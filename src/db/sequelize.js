const { Sequelize, DataTypes } = require('sequelize')
const PokemonModel = require('../models/pokemon')
const UserModel = require('../models/user')
const pokemons = require('./mock-pokemon')
const bcrypt = require('bcrypt')

let sequelize

if (process.env.NODE_ENV === 'production') {
    sequelize = new Sequelize(process.env.DATA_BASE_NAME, 'pokedex_2lqn_user', '8Jy5vQVo5VZVpi1NDjw7TZ5Cvr1xw6VY', {
        host: 'dpg-cghb4u02qv23kcphdl2g-a.frankfurt-postgres.render.com',
        dialect: 'postgres',
        port: process.env.DATA_BASE_PORT,
        dialectOptions: {
            timezone: 'Etc/GMT-2',
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        define: {
            timestamps: false
        }
    })
} else {
    sequelize = new Sequelize('pokedex', 'root', '', {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2',
        },
        logging: false
    })
}

const Pokemon = PokemonModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)

const initDb = () => {
    return sequelize.sync().then(_ => {
        pokemons.map(pokemon => {
            Pokemon.create({
                name: pokemon.name,
                hp: pokemon.hp,
                cp: pokemon.cp,
                picture: pokemon.picture,
                types: pokemon.types
            }).then(pokemon => console.log(pokemon.toJSON()))
        })

        bcrypt.hash('pikachu', 10)
            .then(hash => User.create({ username: 'pikachu', password: hash }))
            .then(user => console.log(user.toJSON()))

        console.log('La base de donnée a bien été initialisée !')
    })
        .catch(error => console.log(`Impossible de synchronisée la base de données ! Erreur: ${error} `))
}

module.exports = {
    initDb, Pokemon, User
}