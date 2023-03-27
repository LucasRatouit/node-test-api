const validTypes = ['Plante', 'Poison', 'Feu', 'Eau', 'Insecte', 'Vol', 'Normal', 'Electrik', 'Fée']

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pokemon', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: `Le nom est déjà pris !`
            },
            validate: {
                notEmpty: { msg: `Le nom ne peut pas être vide !` },
                notNull: { msg: `Le nom une propriété obligatoire !` },
                len: { args: [1, 25], message: `Le nombre de caractères doit-être entre 1 et 25 !` }
            }
        },
        hp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: { msg: `Utilisez uniquement des nombres entiers pour les points de vie !` },
                notNull: { msg: `Les points de vie sont une propriété obligatoire !` },
                max: { args: [999], msg: `Le nombre maximum de points de vie doit être égal ou inférieur à 999` },
                min: { args: [0], msg: `Le nombre minimum de points de vie doit être égal ou supérieur à 0` }
            }
        },
        cp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: { msg: `Utilisez uniquement des nombres entiers pour les points de dégats !` },
                notNull: { msg: `Les points de dégats sont une propriété obligatoire !` },
                max: { args: [99], msg: `Le nombre maximum de points de vie doit être égal ou inférieur à 99` },
                min: { args: [0], msg: `Le nombre minimum de points de vie doit être égal ou supérieur à 0` }
            }
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: { msg: `Utilisez uniquement une "URL" valide pour l'image !` },
                notNull: { msg: `L'image est obligatoire !` }
            }
        },
        types: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                return this.getDataValue('types').split(',')
            },
            set(types) {
                this.setDataValue('types', types.join())
            },
            validate: {
                isTypesValid(value) {
                    if (!value) {
                        throw new Error(`Un pokémon doit avoir au moins un type !`)
                    }
                    if (value.split(',').length > 3) {
                        throw new Error(`Un pokémon ne peux pas avoir plus de trois types !`)
                    }
                    value.split(',').forEach(type => {
                        if (!validTypes.includes(type)) {
                            throw new Error(`Le type d'un pokémon doit appartenir à la liste suivante : ${validTypes} !`)
                        }
                    })
                }
            }
        }
    }, {
        timestamps: true,
        createdAt: 'created',
        updatedAt: false
    })
}