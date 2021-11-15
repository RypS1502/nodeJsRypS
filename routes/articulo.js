const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

/**
 * @swagger
 * components:
 *  schemas:
 *      Articulos:
 *          type: object
 *          required:
 *              - nombre
 *              - precio
 *              - marca
 *              - stock
 *          properties:
 *              id:
 *                  type: string
 *                  description: ID autogenerado para el articulo
 *              nombre:
 *                  type: string
 *                  description: El nombre del articulo
 *              precio:
 *                  type: decimal
 *                  description: El precio del articulo
 *              marca:
 *                  type: string
 *                  description: La marca del articulo
 *              stock:
 *                  type: decimal
 *                  description: El stock existente del articulo
 *          example:
 *              id: r3iq1-Zj
 *              nombre: Lavadora
 *              precio: 1540.0
 *              marca: LG
 *              stock: 15
 */

/**
 * @swagger
 * tags:
 *      name: Articulos
 *      description: API Lista de Articulos
 */

/**
 * @swagger
 *  /articulos:
 *      get:
 *          summary: Devuelve la lista de artículos
 *          tags: [Articulos]
 *          responses:
 *              200:
 *                  description: Lista de las Ventas
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Articulos'  
 */

router.get("/", (req, res) => {
    const articulos = req.app.db.get("articulos");

    res.send(articulos);
})

/**
 * @swagger
 *  /articulos/{id}:
 *      get:
 *          summary: Obtiene un articulo a través de su id
 *          tags: [Articulos]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: El id del articulo
 *          responses:
 *              200:
 *                  description: Articulo Seleccionado por id
 *                  contents:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Articulos'
 *              404:
 *                  description: Articulo no encontrado
 *                  
 */

router.get("/:id", (req, res) => {
    const articulo = req.app.db.get("articulos").find( { id: req.params.id } ).value();

    if(!articulo){
        res.sendStatus(404);
    }else{
        res.send(articulo);
    }
});

/**
 * @swagger
 *  /articulos:
 *      post:
 *          summary: Añadir un nuevo artículo
 *          tags: [Articulos]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Articulos'
 *          responses:
 *              200:
 *                  description: El artículo fue añadido con éxito
 *                  content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Articulos'
 *              500:
 *                  description: Ocurrió algún error
 */

router.post("/", (req, res) => {
    try {
        const articulo = {
            id: nanoid(idLength),
            ...req.body,
        };

        req.app.db.get("articulos").push(articulo).write();

        res.send(articulo);
    } catch(error) {
        return res.status(500).send(error);
    }
});

/**
 * @swagger
 *  /articulos/{id}:
 *      put:
 *          summary: Actualiza un articulo a través de su id
 *          tags: [Articulos]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: El id del articulo
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Articulos'
 *          responses:
 *              200:
 *                  description: El articulo fue actualizado
 *                  contents:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Articulos'
 *              404:
 *                  description: Ningún articulo encontrado
 *              500:
 *                  description: Ocurrió algún error
 * 
 */

router.put("/:id", (req, res) => {
    try{
        req.app.db 
            .get("articulos")
            .find( { id: req.params.id } )
            .assign(req.body)
            .write();
        
        res.send(req.app.db.get("articulos").find( { id: req.params.id } ));
    } catch (error) {
        return res.status(500).send(error);
    }
});

/**
 * @swagger
 *  /articulos/{id}:
 *      delete:
 *          summary: Remover un articulo a través de su id
 *          tags: [Articulos]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: EL id del articulo
 *          responses:
 *              200:
 *                  description: Al articulo fue eliminado
 *              404:
 *                  description: El articulo no fue encontrado
 */

router.delete("/:id", (req, res) => {
    req.app.db
    .get("articulos")
    .remove( { id: req.params.id } )
    .write();

    res.sendStatus(200);
});

module.exports = router;