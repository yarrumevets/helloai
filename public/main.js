let ctx;
let centerX;
let centerY;

const circle = 2 * Math.PI;
const pixelSize = 3;
const pixelMultiplier = 5;

const aWeightInput = document.getElementById("aWeight");
const bWeightInput = document.getElementById("bWeight");
const cBiasInput = document.getElementById("cBias");

const formAText = document.getElementById("formA");
const formBText = document.getElementById("formB");
const formCText = document.getElementById("formC");

const plotPoint = (x, y, color = "black") => {
  // offset x and y from center.
  canvasX = centerX + x * pixelMultiplier;
  canvasY = centerY - y * pixelMultiplier;
  // Draw the dot
  ctx.beginPath();
  ctx.arc(canvasX, canvasY, pixelSize, 0, circle);
  ctx.fillStyle = color;
  ctx.fill();
};

const updateFormulaText = () => {
  formAText.innerText = aWeightInput.value;
  formBText.innerText = bWeightInput.value;
  formCText.innerText = cBiasInput.value;
};
aWeight.addEventListener("click", updateFormulaText);
bWeight.addEventListener("click", updateFormulaText);
cBias.addEventListener("click", updateFormulaText);

const setupCanvas = () => {
  // Setup and draw a coordinate plane
  const canvas = document.getElementById("graph");
  ctx = canvas.getContext("2d");
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
};

const resetCanvas = () => {
  const canvas = document.getElementById("graph");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw vertical line
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.stroke();
  // Draw horizontal line
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.stroke();
};

document.addEventListener("DOMContentLoaded", () => {
  // Init
  setupCanvas();
  updateFormulaText();

  document
    .getElementById("trainAndTestButton")
    .addEventListener("click", () => {
      // hello1(); // Linear example: y = wx+b
      hello2(); // quadratic function: y = ax^2 + bx + c
    });
});

// Hello world #1 - The simplest of them all.
const hello1 = () => {
  // Loads once HTML is loaded and parsed. Doesn't wait for images etc.

  // Note: multiple examples of sample data are used to prevent 'overfitting' to a single example.
  // However, due to the simplicity of this example, which has a deterministic relationship
  // and follows a linear formula with only 1 correct answer, multiple data samples are redundant.
  // Tripling the epoch count and testing only the first sample [1,2] in this case, would have the
  // same level of success.

  // y = 2x + 1
  // [x, y]
  // prediction = w * x + b
  const data = [
    [1, 3],
    [2, 5],
    [3, 7],
    // [4, 9]
  ];

  let w = Math.random(); // weight
  let b = Math.random(); // bias
  // Note: Another issue with this example is that it cannot demonstrate any significant oscillations
  // even with a high learning rate like 0.1. This is also due to the deterministic data:
  // y = 2x + 1 has no 'noise', so there is no struggle to find the correct pattern. As w and b
  // approach the optimal values, updates just become smaller naturally, not requiring an adjustment
  // to the learning rate to prevent a tendency to overshoot. The problem is linear, stable, and so
  // it converges quickly to a solution.
  const learningRate = 0.1;

  const logProgress = (epoch, prediction, x, weight, bias, error) => {
    console.log(
      `Epoch #${epoch + 1}: 
      prediction(${prediction.toFixed(5)}) = w(${weight.toFixed(
        5
      )}) * x(${x}) + b(${bias.toFixed(5)}) --- Error: ${error}`
    );
  };

  function train(data, epochs) {
    for (let i = 0; i < epochs; i++) {
      for (let [x, y] of data) {
        // 3 different examples to work from.
        let prediction = w * x + b;
        let error = y - prediction; // Error
        logProgress(i, prediction, x, w, b, error);
        w += learningRate * error * x; // Update weight
        b += learningRate * error; // Update bias
      }
    }
  }

  // Inference
  function predict(x) {
    const y = w * x + b;
    console.log(`If x is ${x} then y is ${y}`);
    return y;
  }

  console.log("The correct answer is: y = 2x + 0");
  train(data, 200);
  console.log(predict(4)); // Should be ≈9.0
  console.log(predict(411)); // Should be ≈9.0
};

// y = ax^2 + bx + c
const hello2 = () => {
  resetCanvas();

  const epochs = parseInt(document.getElementById("epochs").value);
  const totalSampleData = parseInt(
    document.getElementById("totalSampleData").value
  );

  const aWeight = parseFloat(aWeightInput.value);
  const bWeight = parseFloat(bWeightInput.value);
  const cBias = parseFloat(cBiasInput.value);

  const data = [];
  for (let x = 0; x < totalSampleData; x++) {
    const y = aWeight * x ** 2 + bWeight * x + cBias;
    console.log(
      "x: ",
      x,
      " y: ",
      y,
      " c: ",
      cBias,
      " a: ",
      aWeight,
      " b: ",
      bWeight
    );
    data.push([x, y]);
  }
  console.log("data: ", data);

  // Plot sample data.
  for (let i = 0; i < data.length; i++) {
    plotPoint(data[i][0], data[i][1], "green");
  }

  // Plot correct data outside the sample data range.
  for (let x = data.length - 1; x < 60; x++) {
    const actualY = aWeight * x ** 2 + bWeight * x + cBias;
    plotPoint(x, actualY, "blue");
  }

  let a = Math.random(); // coefficient for x^2
  let b = Math.random(); // coefficient for x
  let c = Math.random(); // bias
  const learningRate = 0.0002;

  // Log progress.
  const logProgress = (epoch, prediction, x, a, b, c, error) => {
    console.log(
      `Epoch #${epoch + 1}:
    prediction(${prediction.toFixed(5)}) = a(${a.toFixed(
        5
      )}) * x(${x})^2 + b(${b.toFixed(5)}) * x + c(${c.toFixed(
        5
      )}) --- Error: ${error}`
    );
  };

  // Train the model.
  function train(data, epochs) {
    for (let i = 0; i < epochs; i++) {
      let MSE = 0; // Mean Squared Error

      for (let [x, y] of data) {
        let prediction = a * x ** 2 + b * x + c;
        let error = y - prediction; // Error
        if (i % 1000 === 0) logProgress(i, prediction, x, a, b, c, error);
        a += learningRate * error * x ** 2; // Update coefficient for x^2
        b += learningRate * error * x; // Update coefficient for x
        c += learningRate * error; // Update bias

        MSE += error ** 2; // makes this # positive and exaggerates it exponentially.
      }

      // Display the MSE ever 1000 iterations.
      MSE = MSE / data.length; // average error
      if (i % 1000 === 0) console.log(`Epoch #${i}: MSE = ${MSE.toFixed(5)}`);
    }
  }

  // Inference function.
  function predict(x) {
    const y = a * x ** 2 + b * x + c;
    plotPoint(x, y, "red");
    console.log(`If x is ${x} then y is ${y}`);
    return y;
  }

  train(data, epochs);

  // Predict remaining values
  for (let i = 11; i < 60; i++) {
    predict(i);
  }
};
