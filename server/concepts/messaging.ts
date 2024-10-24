import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface BlockDoc extends BaseDoc {
    user: ObjectId;
    blocked: string[];
}

export interface MessageDoc extends BaseDoc {
    sender: ObjectId;
    receiver: ObjectId;
    message: string;
    read: boolean;
}

/**
 * concept: Messaging[User]
 */
export default class MessagingConcept {
    public readonly blockData: DocCollection<BlockDoc>;
    public readonly messageData: DocCollection<MessageDoc>;

    /**
     * Make an instance of Messaging.
     */
    constructor(collectionName: string) {
        this.messageData = new DocCollection<MessageDoc>(collectionName);
        this.blockData = new DocCollection<BlockDoc>(collectionName);
        this.messageData.collection.createIndex({ sender: 1 });
        this.messageData.collection.createIndex({ receiver: 1 });
        this.blockData.collection.createIndex({ user: 1 });
    }

    async sendMessage(sender: ObjectId, receiver: ObjectId, message: string) {
        await this.assertNotBlocked(sender, receiver);
        await this.assertNotBlocked(receiver, sender);
        await this.messageData.createOne({ sender, receiver, message, read: false });
        return { msg: "Message sent!" };
    }

    async readMessages(user1: ObjectId, user2: ObjectId) {
        if (!await this.messageData.readOne({ sender: { $in: [ user1, user2 ] },
            receiver: { $in: [ user1, user2 ] } })) {
            throw new NotFoundError("No messages to read!");
        }
        await this.messageData.collection.updateMany(
            { sender: { $in: [ user1, user2 ] },
              receiver: { $in: [ user1, user2 ] } },
            { $set: { read: true } }
        );
        return await this.messageData.readMany({ sender: { $in: [ user1, user2 ] },
            receiver: { $in: [ user1, user2 ] } });
    }

    /**
     * Gets a list of all users the user has sent messages to or received messages from.
     */
    async getAllUsers(user: ObjectId) {
        const users = new Array<ObjectId>();
        // make sure the read entries don't have block data

        const messages = await this.messageData.readMany({ $or: [ { sender: user }, { receiver: user } ], blocked: { $exists: false } },);
        const added = new Array<string>();
        for (const message of messages) {
            if (message.sender.toString() === user.toString() && !added.includes(message.receiver.toString())) {
                added.push(message.receiver.toString());
                users.push(message.receiver);
            } else if (!users.includes(message.sender) && !added.includes(message.sender.toString())) {
                added.push(message.sender.toString());
                users.push(message.sender);
            }
        }
        return users;
    }

    async blockUser(user: ObjectId, recipient: ObjectId) {
        await this.assertNotBlocked(user, recipient);
        await this.blockData.collection.updateOne(
            { user },
            { $push: { blocked: recipient.toString() } }
        );
        return { msg: "User blocked!" };
    }

    async unblockUser(user: ObjectId, recipient: ObjectId) {
        await this.assertIsBlocked(user, recipient);
        await this.blockData.collection.updateOne(
            { user },
            { $pull: { blocked: recipient.toString() } }
        );
        return { msg: "User unblocked!" };
    }

    private async assertNotBlocked(user: ObjectId, recipient: ObjectId) {
        const userBlockData = await this.blockData.readOne({ user });
        if (!userBlockData) {
            await this.createBlockData(user);
            return;
        }
        if (userBlockData.blocked.includes(recipient.toString())) {
            throw new Error("User is blocked!");
        }
    }

    private async assertIsBlocked(user: ObjectId, recipient: ObjectId) {
        const userBlockData = await this.blockData.readOne({ user });
        if (!userBlockData) {
            await this.createBlockData(user);
            return;
        }
        if (!userBlockData.blocked.includes(recipient.toString())) {
            throw new Error("User is not blocked!");
        }
    }

    private async createBlockData(user: ObjectId) {
        return await this.blockData.createOne({ user, blocked: [] });
    }
}