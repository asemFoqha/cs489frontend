export default interface IResponse<T = unknown> {
  success: boolean;
  data: T;
}
