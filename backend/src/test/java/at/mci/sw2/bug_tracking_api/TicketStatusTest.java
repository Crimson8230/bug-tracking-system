package at.mci.sw2.bug_tracking_api;

import org.junit.jupiter.api.Test;

import at.mci.sw2.bug_tracking_api.ticket.TicketStatus;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class TicketStatusTest {

    @Test
    void testOpenStatusTransitions() {
        TicketStatus.Status status = TicketStatus.Status.OPEN;

        // Erlaubt
        assertTrue(status.canTransitionTo(TicketStatus.Status.IN_ANALYSIS));
        assertTrue(status.canTransitionTo(TicketStatus.Status.IN_PROGRESS));
        assertTrue(status.canTransitionTo(TicketStatus.Status.CANCELLED));
        assertTrue(status.canTransitionTo(TicketStatus.Status.OPEN)); // self

        // Nicht erlaubt
        assertFalse(status.canTransitionTo(TicketStatus.Status.DONE));
    }

    @Test
    void testInAnalysisStatusTransitions() {
        TicketStatus.Status status = TicketStatus.Status.IN_ANALYSIS;

        assertTrue(status.canTransitionTo(TicketStatus.Status.IN_PROGRESS));
        assertTrue(status.canTransitionTo(TicketStatus.Status.CANCELLED));
        assertTrue(status.canTransitionTo(TicketStatus.Status.IN_ANALYSIS)); // self

        assertFalse(status.canTransitionTo(TicketStatus.Status.OPEN));
        assertFalse(status.canTransitionTo(TicketStatus.Status.DONE));
    }

    @Test
    void testInProgressStatusTransitions() {
        TicketStatus.Status status = TicketStatus.Status.IN_PROGRESS;

        assertTrue(status.canTransitionTo(TicketStatus.Status.DONE));
        assertTrue(status.canTransitionTo(TicketStatus.Status.IN_ANALYSIS));
        assertTrue(status.canTransitionTo(TicketStatus.Status.CANCELLED));
        assertTrue(status.canTransitionTo(TicketStatus.Status.IN_PROGRESS)); // self

        assertFalse(status.canTransitionTo(TicketStatus.Status.OPEN));
    }

    @Test
    void testEndStatesCannotTransitionFurther() {
        // DONE
        TicketStatus.Status done = TicketStatus.Status.DONE;
        assertTrue(done.canTransitionTo(TicketStatus.Status.DONE)); // self
        assertFalse(done.canTransitionTo(TicketStatus.Status.OPEN));
        assertFalse(done.canTransitionTo(TicketStatus.Status.IN_ANALYSIS));
        assertFalse(done.canTransitionTo(TicketStatus.Status.IN_PROGRESS));
        assertFalse(done.canTransitionTo(TicketStatus.Status.CANCELLED));

        // CANCELLED
        TicketStatus.Status cancelled = TicketStatus.Status.CANCELLED;
        assertTrue(cancelled.canTransitionTo(TicketStatus.Status.CANCELLED)); // self
        assertFalse(cancelled.canTransitionTo(TicketStatus.Status.OPEN));
        assertFalse(cancelled.canTransitionTo(TicketStatus.Status.IN_ANALYSIS));
        assertFalse(cancelled.canTransitionTo(TicketStatus.Status.IN_PROGRESS));
        assertFalse(cancelled.canTransitionTo(TicketStatus.Status.DONE));
    }

    @Test
    void testGetNextAllowedStatusesExcludesSelf() {
        assertEquals(Set.of(), TicketStatus.Status.DONE.getNextAllowedStatuses());
    }
}
