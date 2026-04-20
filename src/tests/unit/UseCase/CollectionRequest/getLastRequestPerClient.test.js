import { GetLastRequestPerClient } from "../../../../domain/useCases/getLastRequestPerClient";

describe("GetLastRequestPerClient", () => {
  test("debe obtener la última solicitud del cliente", async () => {
    // Arrange
    const mockRequest = { idRequest: "req-123" };

    const mockRepo = {
      getLastRequestPerClient: jest.fn().mockResolvedValue(mockRequest),
    };

    const useCase = new GetLastRequestPerClient(mockRepo);

    // Act
    const result = await useCase.execute("client-1");

    // Assert
    expect(mockRepo.getLastRequestPerClient).toHaveBeenCalledWith("client-1");
    expect(result).toEqual(mockRequest);
  });
});