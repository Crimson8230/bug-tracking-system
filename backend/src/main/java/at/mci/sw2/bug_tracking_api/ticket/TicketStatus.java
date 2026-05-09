package at.mci.sw2.bug_tracking_api.ticket;

public class TicketStatus {
    public enum Status {
        OPEN, IN_ANALYSIS, IN_PROGRESS, DONE, CANCELLED;
    }
}
