function response(message: string, status: number,data?:any) {
  return Response.json(
    {
      message,
      success: status < 400,
      data
    },
    {
      status,
    }
  );
}
export default response;
