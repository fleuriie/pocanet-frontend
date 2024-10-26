import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Authing, Cataloging, Discovering, Messaging, Photocarding, Reviewing, Sessioning } from "./app";
import { SessionDoc } from "./concepts/sessioning";

import { z } from "zod";

/**
 * Web server routes for the app. Implements synchronizations between concepts.
 */
class Routes {
  // Synchronize the concepts from `app.ts`.

  @Router.get("/session")
  async getSessionUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Authing.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await Authing.getUsers();
  }

  @Router.get("/users/:username")
  @Router.validate(z.object({ username: z.string().min(1) }))
  async getUser(username: string) {
    return await Authing.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: SessionDoc, username: string, password: string) {
    Sessioning.isLoggedOut(session);
    return await Authing.create(username, password);
  }

  @Router.patch("/users/username")
  async updateUsername(session: SessionDoc, username: string) {
    const user = Sessioning.getUser(session);
    return await Authing.updateUsername(user, username);
  }

  @Router.patch("/users/password")
  async updatePassword(session: SessionDoc, currentPassword: string, newPassword: string) {
    const user = Sessioning.getUser(session);
    return Authing.updatePassword(user, currentPassword, newPassword);
  }

  @Router.delete("/users")
  async deleteUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    Sessioning.end(session);
    return await Authing.delete(user);
  }

  @Router.post("/login")
  async logIn(session: SessionDoc, username: string, password: string) {
    const u = await Authing.authenticate(username, password);
    Sessioning.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: SessionDoc) {
    Sessioning.end(session);
    return { msg: "Logged out!" };
  }

  // RESTFUL API ADDITIONS BEGIN HERE
  
  @Router.post("/photocard/add/:tags")
  async systemAddPhotocard(tags: string, photocardUrl: string) {
    const tagList = tags.split(',');
    tagList.push("System");
    const photocard = await Photocarding.addPhotocard(tagList, photocardUrl);
    return await Cataloging.systemAddItem(photocard.id);
  }

  @Router.delete("/photocard/delete/:id")
  async deletePhotocard(id: string) {
    const oid = new ObjectId(id);
    await Photocarding.removePhotocard(oid);
    return await Cataloging.systemDeleteItem(oid);
  }

  @Router.post("/photocard/:id/tags/add/:tag")
  async systemAddTag(id: string, tag: string) {
    const oid = new ObjectId(id);
    return await Photocarding.addTag(oid, tag)
  }

  @Router.post("/photocard/:id/tags/remove/:tag")
  async systemDeleteTag(id: string, tag: string) {
    const oid = new ObjectId(id);
    return await Photocarding.deleteTag(oid, tag);
  }

  @Router.get("/catalog/:owner")
  async viewCatalog(owner: string) {
    if(owner === "System")  return await Photocarding.searchTags(["System"]);
    else return await Photocarding.searchTags([`owner:${owner}`]);
  }

  @Router.get("/catalog/:owner/:tags")
  async searchCatalog(owner: string, tags: string) {
    const tagList = tags.split(',');
    if(owner === "System")  tagList.push("System");
    else tagList.push(`owner:${owner}`);
    return await Photocarding.searchTags(tagList);
  }

  /**
   * Adds a photocard to the currently active user's collection
   * 
   * @param session Currently active session
   * @param photocard Mongo ID of photocard to be added to collection
   */
  @Router.post("/catalog/edit/add/:photocard")
  async userAddPhotocard(session: SessionDoc, photocard: string) {
    const currentUser = Sessioning.getUser(session);
    const oid = new ObjectId(photocard);
    const currentUsername = await Authing.idsToUsernames([currentUser]);
    const dupe = await Photocarding.duplicatePhotocard(oid, `owner:${currentUsername[0]}`);
    await Photocarding.deleteTag(dupe.id, "System");
    await Cataloging.userAddItem(currentUsername[0], dupe.id);
    return { msg: 'Photocard successfully added to collection!' };
  }

  @Router.post("/catalog/edit/add/:photocard/:tag")
  async userAddTag(session: SessionDoc, photocard: string, tag: string) {
    const currentUser = Sessioning.getUser(session);
    const oid = new ObjectId(photocard);
    const currentUsername = await Authing.idsToUsernames([currentUser]);
    await Photocarding.assertPhotocardHasTag(oid, `owner:${currentUsername[0]}`);
    return await Photocarding.addTag(oid, tag);
  }

  @Router.post("/catalog/edit/remove/:photocard/:tag")
  async userRemoveTag(session: SessionDoc, photocard: string, tag: string) {
    const currentUser = Sessioning.getUser(session);
    const oid = new ObjectId(photocard);
    const currentUsername = await Authing.idsToUsernames([currentUser]);
    await Photocarding.assertPhotocardHasTag(oid, `owner:${currentUsername[0]}`);
    return await Photocarding.deleteTag(oid, tag);
  }

  /**
   * Marks a photocard as available to be discovered by other users
   */
  @Router.post("/catalog/edit/avail/:photocard")
  async markAsAvailable(session: SessionDoc, photocard: string) {
    const currentUser = Sessioning.getUser(session);
    const oid = new ObjectId(photocard);
    const currentUsername = await Authing.idsToUsernames([currentUser]);
    await Photocarding.assertPhotocardHasTag(oid, `owner:${currentUsername[0]}`);
    await Photocarding.addTag(oid, "Available");
    await Discovering.createDiscoverableItem(currentUser, oid);
    return { msg: 'Photocard successfully marked as available!' };
  }

  @Router.post("/catalog/edit/unavail/:photocard")
  async markAsUnavailable(session: SessionDoc, photocard: string) {
    const currentUser = Sessioning.getUser(session);
    const oid = new ObjectId(photocard);
    const currentUsername = await Authing.idsToUsernames([currentUser]);
    await Photocarding.assertPhotocardHasTag(oid, `owner:${currentUsername[0]}`);
    await Photocarding.assertPhotocardHasTag(oid, "Available");
    await Photocarding.deleteTag(oid, "Available");
    await Discovering.removeDiscoverableItem(currentUser, oid);
    return { msg: 'Photocard successfully marked as unavailable!' }; 
  }
  
  /**
   * Recommends an available photocard to the currently logged in user, with a warning
   * if the owner of the photocard has a low average rating.
   */
  @Router.get("/discover")
  async discover(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    await Discovering.createUserDiscovery(user);
    const recommended = await Discovering.recommend(user);
    const owner = await Authing.idsToUsernames([recommended.owner]);
    const averageRating = await Reviewing.getAverageRating(owner[0])
    if(averageRating > 0 && averageRating < 3) {
      return { msg: 'Photocard recommended, but the owner has a poor rating!', owner: owner[0], photocard: recommended.item };
    }
    else {
      return { msg: 'Photocard recommended!', owner: owner[0], photocard: recommended.item };
    }
  }

  /**
   * Sends a message m from the currently active user to the recipient to as long as neither user has
   * blocked each other; throws an error if not.
   */
  @Router.post("/message/send/:to/:m")
  async sendMessage(session: SessionDoc, to: string, m: string) {
    const from = Sessioning.getUser(session);
    const toUser = await Authing.getUserByUsername(to);
    return await Messaging.sendMessage(from, toUser._id, m);
  }

  /**
   * Returns all messages from user from to user to as long as the currently active user
   * is one of those two users. Marks all messages as read.
   */
  @Router.post("/message/read/:to")
  async readMessage(session: SessionDoc, to: string) {
    const from = Sessioning.getUser(session);
    const toUser = await Authing.getUserByUsername(to);
    return await Messaging.readMessages(from, toUser._id);
  }

  @Router.post("/message/block/:user")
  async blockUser(session: SessionDoc, user: string) {
    const from = Sessioning.getUser(session);
    const toOid = await Authing.idsToUsernames([new ObjectId(user)]);
    const toUser = new ObjectId(toOid[0]);
    return await Messaging.blockUser(from, toUser);
  }

  @Router.post("/message/unblock/:user")
  async unblockUser(session: SessionDoc, user: string) {
    const from = Sessioning.getUser(session);
    const toOid = await Authing.idsToUsernames([new ObjectId(user)]);
    const toUser = new ObjectId(toOid[0]);
    return await Messaging.unblockUser(from, toUser);
  }

  @Router.get("/message/recent")
  async getRecentlyMessagedUsers(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    const userList = await Messaging.getAllUsers(user);
    return await Authing.idsToUsernames(userList);
  }

  /**
   * Leaves a review from the currently active user to the user user with a numerical rating
   * and optional textual feedback.
   * 
   * @param session Currently active session.
   * @param user Username of user to leave a review for.
   * @param rating Numerical rating 1-5 for the user, with 5 being the best.
   * @param review Optional textual feedback for the user.
   */
  @Router.post("/reviews/leave/:user")
  async leaveFeedback(session: SessionDoc, user: string, rating: number, review?: string) {
    const from = Sessioning.getUser(session);
    const fromUsername = await Authing.idsToUsernames([new ObjectId(from)]);
    await Reviewing.rateUser(user, fromUsername[0], rating);
    if (review) {
      await Reviewing.reviewUser(user, fromUsername[0], review);
    }
    return { msg: 'Feedback successfully left!' };
  }

  @Router.get("/reviews/average/:user")
  async viewAverageRatings(user: string) {
    return await Reviewing.getAverageRating(user);
  }

  @Router.get("/reviews/:user")
  async viewFeedback(user: string) {
    return await Reviewing.getAllReviews(user);
  }
}

/** The web app. */
export const app = new Routes();

/** The Express router. */
export const appRouter = getExpressRouter(app);
