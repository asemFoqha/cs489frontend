export default interface IUser {
  _id: string;
  fullname: string;
  email: string;
  image?:{
    filename: string;
    originalname: string;
  }
}
