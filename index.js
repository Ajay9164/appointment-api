const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS

const app = express();
const PORT = 3000;

// Use CORS middleware
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/appointmentDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Your existing code...


// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  appointmentDate: { type: String, required: true },
  message: { type: String },
});

// Appointment Model
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Middleware
app.use(bodyParser.json());

// API Endpoint: Book an Appointment
app.post('/api/book-appointment', async (req, res) => {
  const { fullName, email, phone, appointmentDate, message } = req.body;

  // Input validation
  if (!fullName || !email || !phone || !appointmentDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Save data to MongoDB
    const newAppointment = new Appointment({
      fullName,
      email,
      phone,
      appointmentDate,
      message,
    });
    await newAppointment.save();

    res.status(200).json({ message: 'Appointment booked successfully!', data: newAppointment });
  } catch (error) {
    console.error('Error saving appointment:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
