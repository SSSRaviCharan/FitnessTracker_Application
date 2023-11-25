const router = require("express").Router();
const Schema = require("../model/ChartSchema");
const LoginSchema = require("../model/LoginSchema");
const transporter = require("../controller/EmailService");

router.get("/", (req, res, next) => {
  Schema.find((err, data) => {
    if (err) {
      return next(err);
    } else {
      return res.json(data);
    }
  });
});

router.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  // Set up email options
  const mailOptions = {
    from: "fitsync.react@outlook.com", // Sender's email (optional, can be set to the user's email)
    to: "fitsync.react@outlook.com", // Your email address (where you want to receive form submissions)
    subject: "New Contact Form Submission",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/create-user", (req, res, next) => {
  LoginSchema.create(req.body, (err, data) => {
    if (err) {
      return next(err);
    } else {
      return res.json(data);
    }
  });
});

router.post("/create-user-data", (req, res, next) => {
  Schema.create(req.body, (err, data) => {
    if (err) {
      return next(err);
    } else {
      return res.json(data._id);
    }
  });
});

router.get("/retrieve/:id", (req, res, next) => {
  const id = req.params.id;

  Schema.findById(id, (err, data) => {
    if (err) {
      return next(err);
    } else {
      return res.json(data);
    }
  });
});

router.get("/retrieve_data/:id", (req, res, next) => {
  const id = req.params.id;

  LoginSchema.findById(id, (err, data) => {
    if (err) {
      return next(err);
    } else {
      return res.json(data);
    }
  }).select("-password");
});

router.get("/retrieve_password/:id", (req, res, next) => {
  const id = req.params.id;

  LoginSchema.findById(id, (err, data) => {
    if (err) {
      return next(err);
    } else {
      return res.json(data);
    }
  }).select("password");
});

router.post("/updateUser", async (req, res) => {
  try {
    console.log("one");
    await LoginSchema.updateOne(
      { _id: req.body.user },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          height: req.body.height,
          weight: req.body.weight,
          dob: req.body.dob,
        },
      }
    );

    await Schema.updateOne(
      { _id: req.body.user },
      {
        $set: {
          name: req.body.name,
        },
      }
    );

    return res.json({ message: "Success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/updatePassword", async (req, res) => {
  try {
    await LoginSchema.updateOne(
      { _id: req.body.user },
      {
        $set: {
          password: req.body.new_,
        },
      }
    );

    return res.json({ message: "Sucess" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  LoginSchema.findOne({ email: email }).then((record) => {
    if (record) {
      if (record.password === password) {
        res.json(record);
      } else {
        res.json("Login Incorrect");
      }
    } else {
      res.json("No Record Exists");
      console.log("No Record Exists");
    }
  });
});

//this is being used for the leaderboard so do not remove!!!
router.get("/login/:user_id", (req, res) => {
  const { user_id } = req.params;
  LoginSchema.findOne({ _id: user_id }, "name").then((user) => {
    if (user) {
      res.json({ name: user.name });
    } else {
      res.json("User not found");
    }
  });
});

router.post("/email/forgot_password", async (req, res) => {
  try {
    const { email } = req.body;
    const { password } = req.body;
    // console.log(req.body);

    // Assuming LoginSchema is a model from a database, you might want to check if the user exists
    const user = await LoginSchema.findOne({ email });

    if (!user) {
      // return res.status(404).json({ error: "User not found" });
    } else {
      const request_2 = await LoginSchema.updateOne(
        { _id: user },
        {
          $set: {
            password: password,
          },
        }
      );

      const mailOptions = {
        from: "fitsync.react@outlook.com",
        to: email,
        subject: "Forgot Password Email",
        text: `Your New Pasword is "${password}" . Kindly update it in Profile Page`,
      };

      transporter.sendMail(mailOptions, (error, isnfo) => {
        if (error) {
          // console.error(error);
          return res.status(500).json({ error: "Failed to send email" });
        }
        console.log("Email sent: " + info.response);
        res.json({ success: true });
      });

      // return res.json(request_2);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.post("/login", (req, res) => {
//   console.log(req.body);
//   const { email, password } = req.body;
//   LoginSchema.findOne({ email: email, password: password }).then((record) => {
//     if (record) {
//       res.json(record.id);
//     } else {
//       res.json("Login Incorrect");
//     }
//   });
// });

router.post("/check_email", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await LoginSchema.findOne({ email });

    if (!user) {
      return res.json({ status: "Accepted" });
    } else {
      return res.json({ status: "Duplicate" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/updateBmiData", async (req, res) => {
  const { updated_labels, updated_data, user } = req.body;
  try {
    console.log("one");
    await Schema.updateOne(
      { _id: user },
      {
        $set: {
          bmi_labels: updated_labels,
          bmi_data: updated_data,
        },
      }
    );

    return res.json({ message: "BMI updated successfully." });
  } catch (error) {
    return res.json({ message: "Internal server error" });
  }
});

router.post("/updatefatData", async (req, res) => {
  const { updated_labels, updated_data, user } = req.body;
  try {
    console.log("one");
    await Schema.updateOne(
      { _id: user },
      {
        $set: {
          fat_labels: updated_labels,
          fat_data: updated_data,
        },
      }
    );

    return res.json({ message: "Body Fat updated successfully." });
  } catch (error) {
    return res.json({ message: "Internal server error" });
  }
});

router.post("/updateweightData", async (req, res) => {
  const { updated_labels, updated_data, user } = req.body;
  try {
    console.log("one");
    await Schema.updateOne(
      { _id: user },
      {
        $set: {
          weight_label: updated_labels,
          weight_data: updated_data,
        },
      }
    );

    return res.json({ message: "Body Weight updated successfully." });
  } catch (error) {
    return res.json({ message: "Internal server error" });
  }
});

module.exports = router;
