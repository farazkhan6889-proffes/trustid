// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TrustID {
    address public owner;

    struct Credential {
        bytes32 credentialHash;
        address holder;
        address issuer;
        uint256 issuedAt;
        uint256 expiresAt;
        bool revoked;
    }

    mapping(bytes32 => Credential) private credentials;
    mapping(address => bool) public trustedIssuers;

    event IssuerRegistered(address indexed issuer);
    event CredentialIssued(
        bytes32 indexed credentialId,
        address indexed holder,
        address indexed issuer
    );
    event CredentialRevoked(bytes32 indexed credentialId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyIssuer() {
        require(trustedIssuers[msg.sender], "Not a trusted issuer");
        _;
    }

    constructor() {
        owner = msg.sender;
        trustedIssuers[msg.sender] = true;
    }

    function registerIssuer(address issuer) external onlyOwner {
        trustedIssuers[issuer] = true;
        emit IssuerRegistered(issuer);
    }

    function issueCredential(
        bytes32 credentialId,
        bytes32 credentialHash,
        address holder,
        uint256 expiresAt
    ) external onlyIssuer {
        require(holder != address(0), "Invalid holder");
        require(credentials[credentialId].issuedAt == 0, "Credential already exists");

        credentials[credentialId] = Credential({
            credentialHash: credentialHash,
            holder: holder,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            expiresAt: expiresAt,
            revoked: false
        });

        emit CredentialIssued(
            credentialId,
            holder,
            msg.sender
        );
    }

    function revokeCredential(bytes32 credentialId) external {
        Credential storage credential = credentials[credentialId];

        require(credential.issuedAt != 0, "Credential does not exist");
        require(
            msg.sender == credential.issuer || msg.sender == owner,
            "Not authorized"
        );

        credential.revoked = true;

        emit CredentialRevoked(credentialId);
    }

    function verifyCredential(bytes32 credentialId)
        external
        view
        returns (
            bool valid,
            address holder,
            address issuer,
            uint256 issuedAt,
            uint256 expiresAt,
            bool revoked
        )
    {
        Credential memory credential = credentials[credentialId];

        if (credential.issuedAt == 0) {
            return (false, address(0), address(0), 0, 0, false);
        }

        bool notExpired =
            credential.expiresAt == 0 ||
            block.timestamp <= credential.expiresAt;

        valid = !credential.revoked && notExpired;

        return (
            valid,
            credential.holder,
            credential.issuer,
            credential.issuedAt,
            credential.expiresAt,
            credential.revoked
        );
    }
}