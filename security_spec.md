# Security Specification: Lalu Mahendra Creator OS (Multi-Role Owner + Assistant RBAC)

## 1. Data Invariants
1. **Verified Identity Gate**: Every read and write requires `request.auth != null && request.auth.token.email_verified == true`.
2. **Workspace Ownership & Bounded Delegation**: Each workspace (`/workspaces/{workspaceId}`) is owned by one creator (`workspaceId == ownerId`). Up to 5 verified lowercase assistant Google emails may be granted operational access via `assistantEmails` and `/workspaces/{workspaceId}/members/{memberId}`.
3. **Tiered Identity RBAC**:
   - **Owner (`ownerId == request.auth.uid`)**: Full control — manage assistant roster, change 90-day phase, create/edit/sync/delete `contentItems`, `weeklySnapshots`, and `portfolioAssets`.
   - **Assistant (`request.auth.token.email.lower() in assistantEmails`)**: Operational read/create/update on `contentItems`, `weeklySnapshots`, and `portfolioAssets` only while present in the workspace's `assistantEmails`. Assistants CANNOT delete any record, CANNOT alter `ownerId` or `sharedEmails`, CANNOT change `activePhase`, and CANNOT invite or remove members.
4. **Immutable Provenance**: `ownerId` and `createdAt` cannot be modified after creation. `createdAt` and `updatedAt` must equal `request.time`.
5. **No Blanket List Reads & Zero Cost-Explosive Lookups in `list`**: `allow list` strictly evaluates `resource.data.ownerId == request.auth.uid || request.auth.token.email.lower() in resource.data.sharedEmails` (or `assistantEmails` / `email`) without calling `get()` or `exists()`.
6. **PII Isolation**: User emails in `workspaces` and `members` are readable only by the workspace owner or the specifically invited assistant email.
7. **Default Deny Catch-All**: All unspecified paths (including `test/connection`) return `PERMISSION_DENIED`.

## 2. The "Dirty Dozen" Attack Payloads (All Must Fail with PERMISSION_DENIED)
1. **Unauthenticated Read/Write**: Any request with `request.auth == null`.
2. **Unverified Email Spoofing**: Authenticated user whose email matches an assistant email in `assistantEmails`, but `request.auth.token.email_verified == false`.
3. **Assistant Privilege Escalation (Invite Self/Other)**: An assistant attempting to add a new email to `workspaces/{id}.assistantEmails` or create `/workspaces/{id}/members/{newId}`.
4. **Assistant Destructive Delete**: An assistant attempting to `delete` a `ContentItem`, `WeeklySnapshot`, or `PortfolioAsset` owned by the creator.
5. **Assistant `sharedEmails` Tampering**: An assistant updating a `ContentItem` while removing or adding entries to `sharedEmails`.
6. **Cross-Tenant List Scraping**: Uninvited User C running `list` on `contentItems` or `workspaces`.
7. **Ghost / Shadow Field Injection**: Creating/updating a `ContentItem` or `WorkspaceMember` with an undeclared field like `role: "admin"` or `isSuperAdmin: true`.
8. **ID Poisoning**: Creating `/workspaces/{id}/members/bad$id!space` or ID > 128 characters.
9. **Owner Hijack on Create/Update**: User B creating a `ContentItem` with `ownerId: "userA"` without being listed in `workspaces/userA.assistantEmails`, or updating `ownerId` on an existing document.
10. **Array Bloat (Denial of Wallet)**: Creating a `Workspace` or `ContentItem` with `assistantEmails` / `sharedEmails` array length > 5.
11. **Client-Side Timestamp Forgery**: Creating a `WorkspaceMember` or `ContentItem` with `createdAt` != `request.time`.
12. **Out-of-Range Metric / String Poisoning**: Updating `nonFollowerPct: 999`, `views: -500`, or `body30s` > 3000 chars.
