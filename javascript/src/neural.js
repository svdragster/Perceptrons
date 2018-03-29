class Neuron {

    constructor(name) {
        this.name = name;
        this.inputs = [];
        this.destinations = [];
        this.value = 0;
        this.learningRate = 0.005;
    }

    activationFunction(t) {
        return t;
        //return 1/(1+Math.pow(Math.E, -t));
		//return t >= 0 ? 1 : -1; // signum function
	}

	calculateValue(network) {
		var sum = network.bias;
        this.inputs.forEach(function(connectionIn) {
            sum += connectionIn.value * connectionIn.weight;
        });

		var value = this.activationFunction(sum);
        this.destinations.forEach(function (connectionOut) {
            connectionOut.value = value;
        });

        this.value = value;

		return value;
	}

	adjustWeights(delta, network) {
        var neuron = this;
        this.inputs.forEach(function(connectionIn) {
            connectionIn.weight = connectionIn.weight + connectionIn.value * delta * neuron.learningRate;
        });
		network.bias += this.learningRate * delta;
	}
};

class Connection {
    constructor(weight) {
        this.weight = weight;
    }
}

class Layer {
    constructor() {
        this.neurons = new Array();
    }

    push(neuron) {
        this.neurons.push(neuron);
    }

}

class Network {

    constructor(gate) {
        this.gate = gate;
        this.bias = 0.1;

        this.inputLayer = new Layer();
        this.hiddenLayer = new Layer();
        var hiddenLayer2 = new Layer();
        var hiddenLayer3 = new Layer();
        var hiddenLayer4 = new Layer();
        this.outputLayer = new Layer();

        this.hiddenLayers = [
            this.hiddenLayer,
            hiddenLayer2,
            hiddenLayer3
        ];

        for (var i=0; i<9; i++) {
            var input = new Neuron("input" + (i+1));
            this.inputLayer.push(input);
        }

        var hCount = 0;
        // hidden layer 1
        for (var i=0; i<15; i++) {
            var hidden = new Neuron("hidden" + (hCount++));
            this.hiddenLayer.push(hidden);
        }
        // hidden layer 2
        for (var i=0; i<15; i++) {
            var hidden = new Neuron("hidden" + (hCount++));
            hiddenLayer2.push(hidden);
        }
        // hidden layer 3
        for (var i=0; i<12; i++) {
            var hidden = new Neuron("hidden" + (hCount++));
            hiddenLayer3.push(hidden);
        }
        // hidden layer 4
        for (var i=0; i<12; i++) {
            var hidden = new Neuron("hidden" + (hCount++));
            hiddenLayer4.push(hidden);
        }

        var network = this;
        signArray.forEach(function(sign, i) {
            var output = new Neuron("output" + (i+1));
            network.outputLayer.push(output);
        });

        this.connect(this.inputLayer, this.hiddenLayer);
        //this.connect(this.hiddenLayer, this.outputLayer);
        this.connect(this.hiddenLayer, hiddenLayer2);
        this.connect(hiddenLayer2, hiddenLayer3);
        this.connect(hiddenLayer3, this.outputLayer);
    }

    connect(fromLayer, toLayer) {
        fromLayer.neurons.forEach(function(from, index) {
            toLayer.neurons.forEach(function(to, index) {
                var con = new Connection((Math.random()*2) - 1); // Random weight between 1 and -1
                console.log("connected " + from.name + " with " + to.name);
                from.destinations.push(con);
                to.inputs.push(con);
            });
        });
    }

    calculate(inputs, correctOutput) {
        var network = this;
        var training = document.getElementById("myCheckbox").checked;
        inputs.forEach(function(input, index) {
            var neuron = network.inputLayer.neurons[index];
            neuron.value = input;

            neuron.destinations.forEach(function(connectionOut) {
                connectionOut.value = input;
            });
        });

        this.hiddenLayers.forEach(function(layer) {
            layer.neurons.forEach(function(neuron, index) {
                var value = neuron.calculateValue(network);
                if (training) {
                    var correct = -1;
                    if (index < correctOutput.length) correct = correctOutput[index];
                    var delta = correct - value;

                    neuron.adjustWeights(delta, network);
                }
            });
        });


		var foundCorrect = true;
        this.outputLayer.neurons.forEach(function(neuron, index) {
            var value = neuron.calculateValue(network);
            if (training) {
                var correct = -1;
                if (index < correctOutput.length) correct = correctOutput[index];
                var delta = correct - value;

                //if (Math.abs(delta) >= 0.01) foundCorrect = false;
                if (correct == -1 && value >= -0.95) {
                    foundCorrect = false;
                } else if (correct == 1 && value < 0.95) {
                    foundCorrect = false;
                }

                console.log("OUT: " + neuron.name + " " + index + " -> " + value + ", delta " + delta);

                neuron.adjustWeights(delta, network);
            } else {
                console.log("- OUT: " + neuron.name + " " + index + " -> " + value);
            }
        });

		return foundCorrect || !training;
	}
};
