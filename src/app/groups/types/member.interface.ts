export default interface IMember {
  _id: string;
  user_id: string;
  fullname: string;
  email: string;
  pending: boolean;
  image?:{
    filename: string;
    originalname: string;
  }
}
