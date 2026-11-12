import express from "express"
import cors from "cors"
import mysql2 from "mysql2"
import "dotenv/config"

const app = express()

app.use(express.json())
app.use(cors())

const sql = mysql2.createPool({
    host: process.env.HOST_BANCO,
    user: process.env.USUARIO_BANCO,
    password: process.env.SENHA_BANCO,
    database: process.env.NOME_BANCO
})

// Rota GET para listar todas as músicas
app.get("/", (request, response) => {
    const comandoSelect = "SELECT * FROM musicas_eloisa"

    sql.query(comandoSelect, (error, data) => { 
        if (error) {
            console.log(error)
            return
        }

        response.json(data)
    })
})

// Rota GET para buscar apenas uma música específica pelo ID
app.get("/musica/:id", (request, response) => {
    const { id } = request.params

    const comandoSelectMusica = "SELECT * FROM musicas_eloisa WHERE id = ?"

    sql.query(comandoSelectMusica, [id], (error, data) => {
        if (error) {
            console.log(error)
            return
        }

        response.json(data[0])
    })
})

// Rota POST para cadastrar uma nova música
app.post("/cadastrar", (request, response) => {
    const { titulo, artista, genero, ano, duracao } = request.body

    const comandoInsert = "INSERT INTO musicas_eloisa(titulo, artista, genero, ano, duracao) VALUES (?, ?, ?, ?, ?)"

    sql.query(comandoInsert, [titulo, artista, genero, ano, duracao], (error) => {
        if (error) {
            console.log(error)
            return
        }

        response.status(201).json({ mensagem: "Música cadastrada com sucesso!" })
    })
})


app.delete("/apagar/:id", (request, response) => {
    const { id } = request.params

    const comandoDelete = "DELETE FROM musicas_eloisa WHERE id = ?"

    sql.query(comandoDelete, [id], (error) => {
        if (error) {
            console.log(error)
            return
        }

        response.json({ mensagem: "Música apagada com sucesso!" })
    })
})

app.listen(3000, () => {
    console.log("Servidor Online")
})

export default app