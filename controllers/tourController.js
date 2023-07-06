const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  console.log(`tour id is ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(400).json({
      status: 'fail',
      message: 'invalid id , id not found',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'not valid object body',
      message: 'missing requred fild : name , price',
    });
  }
  next();
};

// getting all tours
exports.gettingAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

//getting one tour
exports.getOneTour = (req, res) => {
  console.log(req.params);
  // change the type from string to number
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    // results: tours.length,
    data: {
      tour,
    },
  });
};

//adding one tour
exports.creatingOneTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

//updating one tour

exports.updateOneTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'trour for update ..',
    },
  });
};

//deleting one tour

exports.deleteOneTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: {
      tour: 'trour is deleted ..',
    },
  });
};
