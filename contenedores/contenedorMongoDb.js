import mongoose from "mongoose";

export const asPOJO = (obj) => JSON.parse(JSON.stringify(obj));

export const renameField = (record, from, to) => {
  record[to] = record[from];
  delete record[from];
  return record;
};
export const removeField = (record, field) => {
  const value = record[field];
  delete record[field];
  return value;
};

await mongoose.connect("mongodb+srv://sebasindahouse:Mosi0310@cluster0.epscnqt.mongodb.net/sesiones", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

class ContenedorMongoDb {
  constructor(nombreColeccion, esquema) {
    this.coleccion = mongoose.model(nombreColeccion, esquema);
  }

  async listar(username, password) {
    try {
      const docs = await this.coleccion.find(
        { username, password },
        { __v: 0 }
      );
      if (docs.length == 0) {
        throw new Error("Error al listar por id: no encontrado");
      } else {
        const result = renameField(asPOJO(docs[0]), "_id", "id");
        return result;
      }
    } catch (error) {
      throw new Error(`Error al listar por id: ${error}`);
    }
  }

  async listarAll() {
    try {
      let docs = await this.coleccion.find({}, { __v: 0 }).lean();
      docs = docs.map(asPOJO);
      docs = docs.map((d) => renameField(d, "_id", "id"));
      return docs;
    } catch (error) {
      throw new Error(`Error al listar todo: ${error}`);
    }
  }

  async guardar(nuevoElem) {
    try {
      let doc = await this.coleccion.create(nuevoElem);
      doc = asPOJO(doc);
      renameField(doc, "_id", "id");
      removeField(doc, "__v");
      return doc;
    } catch (error) {
      throw new Error(`Error al guardar: ${error}`);
    }
  }

  async actualizar(nuevoElem) {
    try {
      renameField(nuevoElem, "id", "_id");
      const { n, nModified } = await this.coleccion.replaceOne(
        { _id: nuevoElem._id },
        nuevoElem
      );
      if (n == 0 || nModified == 0) {
        throw new Error("Error al actualizar: no encontrado");
      } else {
        renameField(nuevoElem, "_id", "id");
        removeField(nuevoElem, "__v");
        return asPOJO(nuevoElem);
      }
    } catch (error) {
      throw new Error(`Error al actualizar: ${error}`);
    }
  }

  async borrar(id) {
    try {
      const { n, nDeleted } = await this.coleccion.deleteOne({ _id: id });
      if (n == 0 || nDeleted == 0) {
        throw new Error("Error al borrar: no encontrado");
      }
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`);
    }
  }

  async borrarAll() {
    try {
      await this.coleccion.deleteMany({});
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`);
    }
  }
}

export default ContenedorMongoDb;
