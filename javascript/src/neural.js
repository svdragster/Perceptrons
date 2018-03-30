class Neuron {

    constructor(name) {
        this.name = name;
        this.inputs = [];
        this.destinations = [];
        this.value = 0;
        this.learningRate = 0.005;
    }

    activationFunction(t) {
        if (t > 1.0) {
            t = 1.0;
        } else if (t < -1.0) {
            t = -1.0;
        }
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
            if (connectionIn.weight > 1.0) {
                connectionIn.weight = 1.0;
            } else if (connectionIn.weight < -1.0) {
                connectionIn.weight = -1.0;
            }
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
        this.outputLayer = new Layer();

        this.hiddenLayers = [
            this.hiddenLayer
        ];

        for (var i=0; i<9; i++) {
            var input = new Neuron("input" + (i+1));
            this.inputLayer.push(input);
        }

        var hCount = 0;
        // hidden layer 1
        for (var i=0; i<15; i++) {
            var hidden = new Neuron("hidden (-1) " + (hCount++));
            this.hiddenLayer.push(hidden);
        }

        for (var l=0; l<10; l++) {
            var hiddenL = new Layer();
            this.hiddenLayers.push(hiddenL);
            for (var i=0; i<12; i++) {
                var hidden = new Neuron("hidden (" + l + ") -> " + (hCount++));
                hiddenL.push(hidden);
            }
        }

        var network = this;
        signArray.forEach(function(sign, i) {
            var output = new Neuron("output" + (i+1));
            network.outputLayer.push(output);
        });

        this.connect(this.inputLayer, this.hiddenLayers[0]);
        for (var i=1; i<this.hiddenLayers.length; i++) {
            this.connect(this.hiddenLayers[i-1], this.hiddenLayers[i]);
            console.log("____ connecting layer " + (i-1) + " with " + (i));
        }
        this.connect(this.hiddenLayers[this.hiddenLayers.length - 1], this.outputLayer);
    }

    connect(fromLayer, toLayer) {
        fromLayer.neurons.forEach(function(from, index) {
            toLayer.neurons.forEach(function(to, index) {
                var con = new Connection((Math.random()*2) - 1); // Random weight between 1 and -1
                console.log("... connected " + from.name + " with " + to.name);
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
