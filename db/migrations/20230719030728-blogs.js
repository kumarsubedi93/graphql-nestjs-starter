'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('blogs', {
          id:{
             allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          
          title:{
            type:Sequelize.STRING,
            allowNull:false,
          },


          tags:{
            type: Sequelize.STRING
          },

          description:{
            type: Sequelize.TEXT,
            allowNull:true,
          },
          
          createdAt:{
            type: Sequelize.DATE,
            allowNull:true 
          },

          updatedAt:{
            allowNull: true,
            type: Sequelize.DATE
          }

      })

    },

    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('blogs')
    }
};
