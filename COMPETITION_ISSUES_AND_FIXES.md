# Competition Team Management - Issues and Fixes

## Overview
This document outlines 5 critical issues found in the competition team registration and invitation system, along with recommended fixes.

---

## Issue 1: No Way to Resend Invitation Emails

### Problem
When a team leader registers a team and invites members, if members don't accept the invite (email deleted, forgot, etc.), there is **no way for the leader to resend the invitation email** to that team member.

### Current Behavior
- Initial registration sends emails to all team members (line 60-73 in `participants/route.ts`)
- PUT endpoint only allows adding **new** members, not resending to existing pending ones
- Line 118-119 prevents duplicate invites for non-declined members

### Recommended Fix

**Option A: Add "Resend Invite" Button (Recommended)**
1. Add a new API endpoint: `PATCH /api/competitions/participants/resend-invite`
   - Accepts: `{ participantId, memberEmail }`
   - Validates: Only team leader can resend
   - Action: 
     - Find the pending member by email
     - Generate a new `inviteToken`
     - Send email with new invite link
     - Update the member's `inviteToken` in database

2. Add UI in competition page sidebar:
   - Show "Resend Invite" button next to pending members (only visible to team leader)
   - Button should be disabled if member status is "accepted" or "declined"

**Option B: Modify PUT Endpoint**
- Allow PUT to resend if member already exists with status "pending" or "declined"
- If member exists with status "pending", regenerate token and resend email
- If status is "declined", allow re-invitation

**Implementation Priority:** High - This is a critical UX issue

---

## Issue 2: Incomplete Duplicate Registration Check

### Problem
When a user registers or accepts an invitation, the system doesn't fully check if that user is already present in any team in that competition (as leader OR as member, including pending members).

### Current Behavior

**Registration (POST `/api/competitions/participants`):**
- ✅ Checks if user is already a **leader** (line 35-42)
- ❌ **Does NOT check** if user is already a **member** (pending or accepted) in another team
- ❌ **Does NOT check** if user is already a **leader** in another team by email

**Invite Response (POST `/api/competitions/participants/invite-response`):**
- ✅ Checks if user is already a **leader** by userId (line 54)
- ✅ Checks if user is already an **accepted member** by userId (line 55)
- ✅ Checks if user is already a **leader** by email (line 56)
- ❌ **Does NOT check** if user is already a **pending member** in another team

### Recommended Fix

**For Registration (POST endpoint):**
```typescript
// After line 38, add comprehensive check:
const existingParticipant = await Participant.findOne({
  competitionId: body.competitionId,
  $or: [
    { userId: body.userId }, // Already a leader
    { 'teamLeader.email': body.teamLeader.email }, // Leader by email
    { 'teamMembers.email': body.teamLeader.email }, // Member by email (any status)
    { 'teamMembers.userId': body.userId } // Accepted member by userId
  ]
});

if (existingParticipant) {
  return NextResponse.json({ 
    error: 'You are already registered or invited to a team in this competition.' 
  }, { status: 400 });
}
```

**For Invite Response (already partially implemented, but needs enhancement):**
```typescript
// Enhance the existing check at line 51-62 to include pending members:
const alreadyParticipant = await Participant.findOne({
  competitionId: competitionId,
  $or: [
    { userId: memberObjectId }, // Leader of another team
    { 'teamMembers.userId': memberObjectId }, // Accepted member
    { 'teamMembers.email': memberEmail, 'teamMembers.status': { $in: ['pending', 'accepted'] } }, // Pending or accepted by email
    { 'teamLeader.email': memberEmail } // Leader by email
  ],
  _id: { $ne: teamId }
});
```

**Implementation Priority:** High - Prevents data integrity issues

---

## Issue 3: User with Pending Invite Can Create Own Team

### Problem
If a user is added to any team by any team leader (status: "pending"), they can still create their own team as a leader before accepting/declining the invite.

### Current Behavior
- Registration check (line 35-42) only checks if user is already a **leader**, not if they have a **pending invite**
- A user with a pending invite can register as a leader, creating duplicate registrations

### Recommended Fix

**Enhance Registration Check:**
```typescript
// In POST /api/competitions/participants, after line 38:
// Check if user is already a leader
const existingLeader = await Participant.findOne({
  competitionId: body.competitionId,
  userId: body.userId
});

if (existingLeader) {
  return NextResponse.json({ error: 'Already registered for this competition' }, { status: 400 });
}

// Check if user has pending/accepted invite as member
const existingMember = await Participant.findOne({
  competitionId: body.competitionId,
  $or: [
    { 'teamMembers.email': body.teamLeader.email, 'teamMembers.status': { $in: ['pending', 'accepted'] } },
    { 'teamMembers.userId': body.userId, 'teamMembers.status': { $in: ['pending', 'accepted'] } }
  ]
});

if (existingMember) {
  return NextResponse.json({ 
    error: 'You have a pending or accepted invitation to another team. Please accept or decline it first.' 
  }, { status: 400 });
}
```

**Implementation Priority:** High - Prevents conflicts and confusion

---

## Issue 4: Invite Link Email Validation Issue

### Problem
When a leader invites a member, the invite link requires the user to accept through the PitchDesk account matching that email. However, if someone copies the invite link URL, they could potentially accept it through a different email account on PitchDesk.

### Current Behavior
- Invite link contains `token` and `teamId` (line 45, 62, 126)
- Token is stored in `teamMembers.inviteToken` (line 51, 123)
- When accepting, system checks:
  - Token matches (line 64-68)
  - Member email matches session email (line 75-77)
  - User is not already in another team (line 51-62)

### Analysis
✅ **Current implementation is CORRECT:**
- Line 75-77: `if (memberEmail !== member.email)` prevents accepting with wrong email
- The invite is tied to the specific email address in the database
- Even if someone copies the link, they must be logged in with the correct email

### Potential Edge Case
If a user has multiple PitchDesk accounts with different emails, they could:
1. Receive invite at email A
2. Copy the link
3. Login with email B
4. Try to accept → **This should fail** (and does, due to line 75-77 check)

### Recommended Fix

**No fix needed** - The current implementation is secure. However, consider:

**Enhancement (Optional):**
- Add clearer error message when email mismatch occurs
- Consider adding invite expiration (currently tokens don't expire)
- Add logging for failed acceptance attempts

**Implementation Priority:** Low - Current behavior is correct, but could add expiration

---

## Issue 5: Cannot Remove Pending Team Members

### Problem
If a team member has not accepted the invite yet, the team leader should be able to remove/delete that member from the team so they can invite a different member if needed.

### Current Behavior
- `removeTeamMember` function exists in `registration-form.tsx` (line 96), but only works **before** form submission
- Once team is registered, there's **no way to remove pending members**
- PUT endpoint only allows **adding** members, not removing
- No DELETE endpoint exists for removing team members

### Recommended Fix

**Add DELETE Endpoint:**
1. Create new endpoint: `DELETE /api/competitions/participants/member`
   - Accepts: `{ participantId, memberEmail }` or `{ participantId, memberIndex }`
   - Validates:
     - Only team leader can remove
     - Member status must be "pending" (cannot remove accepted members)
     - Check team size constraints after removal
   - Action:
     - Remove member from `teamMembers` array
     - Update `teamStatus` if needed (if team becomes incomplete)
     - Return updated participant

2. Add UI in competition page sidebar:
   - Show "Remove" button next to pending members (only visible to team leader)
   - Button should be disabled for "accepted" or "declined" members
   - Show confirmation dialog before removal

**Alternative: PATCH Endpoint**
- Use `PATCH /api/competitions/participants` to update teamMembers array
- Remove the specific member from array
- Validate and save

**Implementation Example:**
```typescript
// DELETE /api/competitions/participants/member
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { participantId, memberEmail } = body;
    
    const participant = await Participant.findById(participantId);
    if (!participant) {
      return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
    }
    
    // Only team leader can remove
    if (session.user.email !== participant.teamLeader.email) {
      return NextResponse.json({ error: 'Only team leader can remove members.' }, { status: 403 });
    }
    
    // Find member
    const memberIndex = participant.teamMembers.findIndex(
      m => m.email === memberEmail
    );
    
    if (memberIndex === -1) {
      return NextResponse.json({ error: 'Member not found.' }, { status: 404 });
    }
    
    const member = participant.teamMembers[memberIndex];
    
    // Only allow removing pending members
    if (member.status !== 'pending') {
      return NextResponse.json({ 
        error: 'Can only remove members with pending invitations.' 
      }, { status: 400 });
    }
    
    // Remove member
    participant.teamMembers.splice(memberIndex, 1);
    
    // Update team status if needed
    const comp = await Competition.findById(participant.competitionId);
    const minSize = comp?.teamSize?.min || 1;
    const acceptedCount = 1 + participant.teamMembers.filter(
      m => m.status === 'accepted'
    ).length;
    
    if (acceptedCount < minSize) {
      participant.teamStatus = 'incomplete';
    }
    
    await participant.save();
    return NextResponse.json({ success: true, participant });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**Implementation Priority:** High - Critical for team management flexibility

---

## Summary of Implementation Priorities

| Issue | Priority | Complexity | Impact |
|-------|----------|------------|--------|
| Issue 1: Resend Invite | High | Medium | High UX impact |
| Issue 2: Duplicate Check | High | Low | Data integrity |
| Issue 3: Pending Invite Check | High | Low | Prevents conflicts |
| Issue 4: Email Validation | Low | N/A | Already correct |
| Issue 5: Remove Pending Members | High | Medium | Team management |

---

## Additional Recommendations

1. **Add Invite Expiration**: Consider adding `inviteExpiry` field to teamMembers schema to expire old invites
2. **Email Notifications**: Send reminder emails to pending members after X days
3. **Audit Logging**: Log all team member additions/removals for debugging
4. **Team Status Updates**: Ensure teamStatus is properly updated when members are added/removed
5. **Frontend Validation**: Add client-side checks before API calls to improve UX

---

## Files That Need Modification

1. `src/app/api/competitions/participants/route.ts` - Add resend and remove endpoints, enhance checks
2. `src/app/api/competitions/participants/invite-response/route.ts` - Enhance duplicate check
3. `src/app/(others)/competitions/[id]/page.tsx` - Add UI for resend/remove buttons
4. `src/models/Participant.ts` - Consider adding `inviteExpiry` field (optional)

