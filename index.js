const express = require("express");
const app = express();
const cors = require("cors")

const corsOptions = {
  origin: "*",
  credentials: true
}

app.use(cors(corsOptions))

const { initializeData } = require('./db/db.connect');
const Hotel = require('./models/hotels.models');

app.use(express.json());

async function startServer() {
    await initializeData(); // Ensure you await the database initialization
    //console.log("Connected Successfully");
    
    const newHotel = {
      name: "Sunset Resort",
      category: "Resort",
      location: "12 Main Road, Anytown",
      rating: 4.0,
      reviews: [],
      website: "https://sunset-example.com",
      phoneNumber: "+1299655890",
      checkInTime: "2:00 PM",
      checkOutTime: "11:00 AM",
      amenities: ["Room Service", "Horse riding", "Boating", "Kids Play Area", "Bar"],
      priceRange: "$$$$ (61+)",
      reservationsNeeded: true,
      isParkingAvailable: true,
      isWifiAvailable: true,
      isPoolAvailable: true,
      isSpaAvailable: true,
      isRestaurantAvailable: true,
      photos: ["https://example.com/hotel2-photo1.jpg", "https://example.com/hotel2-photo2.jpg"],
    };



    async function createHotel(newHotel){
      try{
         const hotel = new Hotel(newHotel)
         const savedHotel = await hotel.save();
         return savedHotel
      }
      catch(error){
          throw error
      }
    }

    app.post("/hotels", async(req, res)=>{
      try{
       const saveHotel = await createHotel(req.body)
       res.status(201).json({message: 'Hotel saved successfully'})
      }catch(error){
        res.status(500).json({error: 'failed to add hotel'})
      }
    })


    // Set up the route to fetch hotels
    app.get("/hotels", async (req, res) => {
        try {
            const hotels = await readAllHotels(); // Fetch hotels
            //console.log("Fetched hotels:", hotels);
            if (hotels && hotels.length > 0) {
                res.json(hotels); // Send hotels if found
            } else {
                res.status(404).json({ error: "No Hotel Found" }); // Handle no hotels found
            }
        } catch (error) {
            console.log("Error in /hotels route:", error);
            res.status(500).json({ error: "failed to fetch hotel" });
        }
    });

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
}

// Create a function to read all hotels from the database.
async function readAllHotels() {
    try {
        const allHotels = await Hotel.find();
        //console.log("Fetched Hotels:", allHotels);
        return allHotels;
    } catch (error) {
        console.log("Error fetching hotels:", error);
    }
}


// Create a function to read  hotel by name from the database.
async function readByHotelName(hotelName) {
  try {
    const hotel = await Hotel.findOne({ name: hotelName });
    return hotel;
  } catch (error) {
    throw error;
  }
}


app.get("/hotels/:hotelName", async(req, res)=>{
  try{
    const hotels = await readByHotelName(req.params.hotelName)
    if(hotels.length!=0){
      res.json(hotels)
    }else{
      res.status(404).json({error: 'No Hotel Found'})
    }
  }catch(error){
      res.status(500).json({error: 'failed to fetch hotels'})
  }
})



// Create a function to read  hotel by phoneNumbers from the database.
async function readByHotelNumber(hotelNumber){
  try {
    const hotel = await Hotel.findOne({ phoneNumber: hotelNumber });
    return hotel;
  } catch (error) {
    throw error;
  }
}


// app.get("/hotels/directory/:phoneNumber", async(req, res)=>{
//   try{
//     const hotels = await readByHotelNumber(req.params.phoneNumber)
//     if(hotels.length!=0){
//       res.json(hotels)
//     }else{
//       res.status(404).json({error: 'No Hotel Found'})
//     }
//   }catch(error){
//     res.status(500).json({error: 'failed to fetch hotels'})
//   }
// })


async function hotelByParking() {
  try {
    const hotel = await Hotel.find({ isParkingAvailable: true });
    console.log(hotel);
  } catch (error) {
    throw error;
  }
}
//hotelByParking()


async function hotelByRestaurant() {
  try {
    const hotel = await Hotel.find({ isRestaurantAvailable: true });
    console.log(hotel);
  } catch (error) {
    throw error;
  }
}
//hotelByRestaurant()

async function hotelById(hotelId){
  try{
   const deletedHotel = await Hotel.findByIdAndDelete(hotelId)
   return deletedHotel
  }catch(error){
    console.log(error)
  }
}

app.delete("/hotels/:hotelId", async(req, res)=>{
  try{
     const deletedHotel = await hotelById(req.params.hotelId)
     res.status(400).json({message: 'Hotel deleted successfully'})
  }catch(error){
    res.status(500).json({error: 'Failed to delete Hotel'})
  }
})


async function readByHotelCategory(category) {
  try {
    const hotel = await Hotel.find({ category: category });
    return hotel;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/category/:hotelCategory", async(req, res)=>{
  try{
    const hotels = await readByHotelCategory(req.params.hotelCategory)
    if(hotels){
      res.json(hotels)
    }else{
      res.status(404).json({error: 'No Hotel Found'})
    }
  }catch(error){
      res.status(500).json({error: 'failed to fetch data'})
  }
})


async function hotelByPrice(price) {
  try {
    const hotel = await Hotel.find({ price: price });
    console.log(hotel);
  } catch (error) {
    throw error;
  }
}


async function readHotelByRating(rating) {
  try {
    const hotel = await Hotel.find({ rating: rating });
    return hotel;
  } catch (error) {
    throw error;
  }
}



app.get("/hotels/rating/:hotelRating", async(req, res)=>{
  try{
     const hotels = await readHotelByRating(req.params.hotelRating)
     if(hotels){
        res.json(hotels)
     }else{
        res.status(404).json({error: 'No Hotel Found'})
     }
  }catch(error){
    res.status(500).json({error: 'failed to fetch hotels'})
  }
})
// Start the server and the hotel insertion
startServer();
