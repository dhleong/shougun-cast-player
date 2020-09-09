export class ShougunQueue extends cast.framework.QueueBase {
    public static create(
        context: cast.framework.CastReceiverContext,
    ) {
        return new ShougunQueue(
            context.getPlayerManager().getQueueManager(),
        );
    }

    constructor(
        mgr: cast.framework.QueueManager,
    ) {
        super();
    }
}
