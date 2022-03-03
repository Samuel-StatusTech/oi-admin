function Managers() {
  let uid;
  let client;
  let email;
  let master = true;
  function fromJson(json) {
    this.uid = json['uid'];
    this.client = json['client'];
    this.email = json['email'];
    this.master = json['master'];
    return this;
  }
  function toJson() {
    return {
      uid: this.uid,
      client: this.client,
      email: this.email,
      master: this.master,
    };
  }
  return { uid, client, email, master, fromJson, toJson };
}
export default Managers;
