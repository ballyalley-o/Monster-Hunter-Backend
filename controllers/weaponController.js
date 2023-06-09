"use strict";
const axios = require("axios"); // npm i
const Models = require("../models"); //matches index.js



//Fetches all weapons
const getAllWeapons = (res)=>{

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://mhw-db.com/weapons',
      headers: { }
    };
    axios.request(config)
    .then((response) => {
      console.log(response.data);
      res.send(response.data)
    })
    .catch((error) => {
      console.log(error);
    });
  }




// add favorite weapon to database
const addFavoriteWeapon = async (body, res) => {
    const { userId, weaponId } = body;
  
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://mhw-db.com/weapons/${weaponId}`,
      headers: {}
    };
  
    // Step 1 - retrieve monsters from API
    let weapon = await axios.request(config)
      .then((response) => {
        
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  
    // Step 2 - modify weapon to include userId
      weapon.userId = userId
  
    // Step 3 - add weapon to user's favorite weapon collection
      Models.FavoriteWeapon(weapon)
      .save()
      .then((data) => res.send({ result: 200, data: data, message: "Weapon added to favorites"}))
      .catch((err) => {
        console.log(err);
        res.send({ result: 500, error: err.message });
      });
  };

  
// delete favorite weapon from database
const deleteFavoriteWeapon = async (req, res) => {
    const { userId, weaponId } = req.body;
  
    Models.FavoriteWeapon.deleteOne({id: weaponId , userId: userId })
    .then((response)=>{
      res.status(200).send({
        result: 200,
        data: response,
        message: "Favorite weapon deleted successfully",
      });
    })
    .catch((err)=>{res.send(err)}) 
  };

  //Find all user's favorite weapons
  const getFavoriteWeaponsByUserId = async (userId, res) => {

    Models.FavoriteWeapon.find({userId: userId})
    .then((response)=>{
      res.status(200).send({
        result: 200,
        data: response,
        message: "User's favorite weapon(s) retrieved successfully",
      });
    })
      }
    


  module.exports = {
    getAllWeapons,
    addFavoriteWeapon,
    deleteFavoriteWeapon,
     getFavoriteWeaponsByUserId,
}