import DocCollection, { BaseDoc } from "../framework/doc";

export interface ReviewDoc extends BaseDoc {
    user: string;
    ratings: Map<string, number>;
    reviews: Map<string, string>;
}

/**
 * concept: Reviewing[User]
 */
export default class ReviewingConcept {
    public readonly reviewData: DocCollection<ReviewDoc>;

    /**
     * Make an instance of Reviewing.
     */
    constructor(collectionName: string) {
        this.reviewData = new DocCollection<ReviewDoc>(collectionName);
        this.reviewData.collection.createIndex({ user: 1 });
    }

    async rateUser(user: string, reviewer: string, rating: number) {
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5!");
        }
        if (!await this.reviewData.readOne({ user })) {
            await this.createReviewData(user);
        }
        return await this.reviewData.collection.updateOne(
            { user },
            { $set: { [`ratings.${reviewer}`]: rating } }
        );
    }

    async reviewUser(user: string, reviewer: string, review: string) {
        if (!await this.reviewData.readOne({ user })) {
            await this.createReviewData(user);
        }
        return await this.reviewData.collection.updateOne(
            { user },
            { $set: { [`reviews.${reviewer}`]: review } }
        );
    }

    async getAverageRating(user: string) {
        const ratings = await this.reviewData.readOne({ user },
            { projection: { ratings: 1 } });
        if (!ratings) {
            return 0;
        }
        const values = Object.values(ratings.ratings);
        const sum = values.reduce((a, b) => Number(a) + Number(b), 0);
        return sum / values.length;
    }

    async getAllReviews(user: string) {
        const reviews = await this.reviewData.readOne({ user });
        if (!reviews) {
            return `No reviews found for ${user}!`;
        }
        return reviews;
    }

    private async createReviewData(user: string) {
        return await this.reviewData.createOne({ user, ratings: new Map(), reviews: new Map() });
    }
}