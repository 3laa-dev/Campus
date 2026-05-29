const factory = require("../../controllers/handlersFactory");

describe("Factory Unit Tests", () => {


  describe("createOne", () => {

    it("should create document and return response", async () => {

      const mockModel = {
        create: jest.fn().mockResolvedValue({
          _id: "1",
          title: "Test"
        })
      };

      const req = {
        body: { title: "Test" }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const handler = factory.createOne(mockModel);

      await handler(req, res);

      expect(mockModel.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

  });

  describe("getAll", () => {

    it("should return all documents", async () => {

      const mockData = [{ title: "A" }, { title: "B" }];

      const mockModel = {
        find: jest.fn().mockResolvedValue(mockData)
      };

      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const handler = factory.getAll(mockModel);

      await handler(req, res);

      expect(mockModel.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockData
        })
      );
    });

  });

  
  describe("getOne", () => {

    it("should return single document by id", async () => {

      const mockDoc = { _id: "1", title: "Test" };

      const mockModel = {
        findById: jest.fn().mockResolvedValue(mockDoc)
      };

      const req = {
        params: { id: "1" }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const handler = factory.getOne(mockModel);

      await handler(req, res);

      expect(mockModel.findById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockDoc
        })
      );
    });

  });

  describe("updateOne", () => {

    it("should update document and return new one", async () => {

      const updatedDoc = { _id: "1", title: "Updated" };

      const mockModel = {
        findByIdAndUpdate: jest.fn().mockResolvedValue(updatedDoc)
      };

      const req = {
        params: { id: "1" },
        body: { title: "Updated" }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const handler = factory.updateOne(mockModel);

      await handler(req, res);

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        req.body,
        { returnDocument: "after" }
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: updatedDoc
        })
      );
    });

  });

  
  describe("deleteOne", () => {

    it("should delete document by id", async () => {

      const mockModel = {
        findByIdAndDelete: jest.fn().mockResolvedValue({})
      };

      const req = {
        params: { id: "1" }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const handler = factory.deleteOne(mockModel);

      await handler(req, res);

      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });

  });

});