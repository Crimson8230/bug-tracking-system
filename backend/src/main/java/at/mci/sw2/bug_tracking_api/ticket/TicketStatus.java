package at.mci.sw2.bug_tracking_api.ticket;

import java.util.Set;

public class TicketStatus {
    public enum Status {
        OPEN, IN_ANALYSIS, IN_PROGRESS, DONE, CANCELLED;

        public Set<Status> getNextAllowedStatuses() {
            return switch (this) {
                case OPEN -> Set.of(IN_ANALYSIS, IN_PROGRESS, CANCELLED);
                case IN_ANALYSIS -> Set.of(IN_PROGRESS, CANCELLED);
                case IN_PROGRESS -> Set.of(DONE, IN_ANALYSIS, CANCELLED);
                case DONE, CANCELLED -> Set.of(); // Endzustände
            };
        }

        public boolean canTransitionTo(Status nextStatus) {
            return this == nextStatus || getNextAllowedStatuses().contains(nextStatus);
        }
    }
}
