import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface PhotocardDoc extends BaseDoc {
    tags: string[];
    photocardUrl: string;
}


/**
 * concept: Photocarding
 */
export default class PhotocardingConcept {
    public readonly photocards: DocCollection<PhotocardDoc>;
  
    /**
     * Make an instance of Photocarding.
     */
    constructor(collectionName: string) {
      this.photocards = new DocCollection<PhotocardDoc>(collectionName);
      void this.photocards.collection.createIndex({ tags: 1 });
    }

    async getPhotocardById(_id: ObjectId) {
        const photocard = await this.photocards.readOne({ _id });
        if (!photocard) {
            throw new PhotocardNotFoundError(_id);
        }
        return photocard;
    }
    
    /**
     * Adding a new photocard to the system, defined by its tags.
     */
    async addPhotocard(tags: string[], photocardUrl: string) {
        await this.assertPhotocardNotExists(tags);
        const _id = await this.photocards.createOne({ tags, photocardUrl });
        return { msg: "Photocard added successfully!", id: _id };
    }

    async removePhotocard(_id: ObjectId) {
        await this.assertPhotocardExists(_id);
        await this.photocards.deleteOne({ _id });
        return { msg: "Photocard deleted!" };
    }
    
    /**
     * Creates a copy of the photocard with Mongo ID _id with the exact same tags and a new one added
     * to distinguish the copy.
     * 
     * @param _id Mongo ID of the photocard to be duplicated
     * @param newTag Additional tag to distinguish the duplicate from the original
     */
    async duplicatePhotocard(_id: ObjectId, newTag: string) {
        const orig = await this.photocards.readOne({_id});
        if(!orig) {
            throw new PhotocardNotFoundError(_id);
        }
        var tags = orig.tags;
        tags.push(newTag);
        return await this.addPhotocard(tags, orig.photocardUrl);
    }

    async addTag(_id: ObjectId, newTag: string) {
        this.assertTagValid(newTag);
        await this.assertPhotocardExists(_id);
        return await this.photocards.collection.updateOne({_id}, { $push: { tags: newTag }})
    }

    async deleteTag(_id: ObjectId, tagToDelete: string) {
        await this.assertPhotocardExists(_id);
        return await this.photocards.collection.updateOne({_id}, { $pull: { tags: tagToDelete }})
    }

    /**
     * Searches for and returns all photocards that are tagged with the given tags.
     */
    async searchTags(tagsToSearch: string[]) {
        return await this.photocards.readMany({ tags: { $all: tagsToSearch } });
    }

    /**
     * Searches for and returns a photocard that exactly matches the proposed set of tags.
     */
    private async searchTagsExactMatch(tagsToSearch: string[]) {
        const filter = {
            $expr: {
              $and: [
                { $eq: [{ $size: "$tags" }, tagsToSearch.length] },
                { $setIsSubset: [tagsToSearch, "$tags"] },
                { $setIsSubset: ["$tags", tagsToSearch] }
              ]
            }
          };
        return await this.photocards.readOne(filter);
    }

    /**
     * Throws an error if the photocard with id _id does not have tag tag.
     */
    async assertPhotocardHasTag(_id: ObjectId, tag: string) {
        const photocard = await this.photocards.readOne({_id});
        if(!photocard) {
            throw new PhotocardNotFoundError(_id);
        }
        if(!photocard.tags.includes(tag)) {
            throw new NotAllowedError(`Photocard ${_id} does not have tag ${tag}!`);
        }
    }
    
    /**
     * Throws an error if there exists no photocard with id _id.
     */
    private async assertPhotocardExists(_id: ObjectId) {
        const maybePhotocard = await this.photocards.readOne({ _id });
        if (!maybePhotocard) {
            throw new PhotocardNotFoundError(_id);
        }
    }
    
    /**
     * Throws an error if there exists a photocard that exactly matches the proposed set of tags.
     */
    private async assertPhotocardNotExists(tags: string[]) {
        const maybePhotocard = await this.searchTagsExactMatch(tags);
        if (maybePhotocard) {
            throw new PhotocardAlreadyExistsError(tags);
        }
    }

    private async assertTagValid(tag: string) {
        if (tag === "System") {
            throw new NotAllowedError("Cannot add tag 'System' to photocard!");
        }
        if (tag === "") {
            throw new NotAllowedError("Cannot add empty tag to photocard!");
        }
        if (tag.startsWith("owner:")) {
            throw new NotAllowedError("Cannot try to mark a photocard as owned by a user!");
        }
        if (tag.includes(" ")) {
            throw new NotAllowedError("Tags cannot contain spaces!");
        }
    }
  }

export class PhotocardNotFoundError extends NotFoundError {
    constructor(
        public readonly _id: ObjectId,
    ) {
        super(`Photocard ${_id} does not exist!`);
    }
}

export class PhotocardAlreadyExistsError extends NotAllowedError {
    constructor(
        public readonly tags: string[],
    ) {
        super(`Photocard with tags ${tags} already exists!`);
    }
}