function response(message: string, status: number, data?: any) {
  return Response.json(
    { success: status < 400, message: message, data },
    {
      status: status,
    }
  );
}
export default response;
