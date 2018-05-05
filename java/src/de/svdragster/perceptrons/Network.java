package de.svdragster.perceptrons;

import de.svdragster.perceptrons.layers.Layer;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by z003p2yd on 26.03.2018.
 */
public class Network {
	
    public Layer inputLayer;
    public List<Layer> hiddenLayers;
    public Layer outputLayer;
    
	//public List<Neuron> inputLayer 		= new ArrayList<>();
	//public List<Neuron> hiddenLayer 	= new ArrayList<>();
	//public List<Neuron> outputLayer	 	= new ArrayList<>();

	private float bias = 0.1f;

	public Network(int inputAmount, int outputSize) {
		// input feeds to hidden layer (or output)
        
        inputLayer = new Layer();
        hiddenLayers = new ArrayList<>();
        outputLayer = new Layer();
        
        for (int i=0; i<inputAmount; i++) {
            InputNeuron input = new InputNeuron("input" + i, 1);
            inputLayer.add(input);
        }

		final int hiddenAmount = 10;
		for (int i=0; i<hiddenAmount; i++) {
            Layer hiddenLayer = new Layer();
		    for (int neurons=0; neurons<3; neurons++) {
                Neuron hidden = new Neuron("hidden" + (i*hiddenAmount + neurons));
                hiddenLayer.add(hidden);
            }
            
            hiddenLayers.add(hiddenLayer);
        }

        for (int i=0; i<outputSize; i++) {
            Neuron output = new Neuron("output" + i);
            outputLayer.add(output);
        }

		connect(inputLayer,  hiddenLayers.get(0));
		for (int i=1; i<hiddenLayers.size(); i++) {
		    connect(hiddenLayers.get(i-1), hiddenLayers.get(i));
        }
		connect(hiddenLayers.get(hiddenLayers.size()-1), outputLayer);

		//connect(inputLayer, outputLayer);
	}

	public void connect(Layer fromLayer, Layer toLayer) {
		for (Neuron from : fromLayer.getNeurons()) {
			for (Neuron to : toLayer.getNeurons()) {
				Connection connection = new Connection(0, (float) (Math.random()*2-1));
				from.getDestinations().add(connection);
				to.getInput().add(connection);

				System.out.println("__________ " + from.getName() + " connected to " + to.getName());
			}
		}
	}

	public boolean calculate(float[] inputs, float correctOutputs[]) {
		for (int i=0; i<inputs.length; i++) {
			Neuron neuron = inputLayer.get(i);
			neuron.setValue(inputs[i]);
			neuron.calculateValue(this);
		}

		for (Layer hiddenLayer : hiddenLayers) {
            for (int i = 0; i < hiddenLayer.size(); i++) {
                Neuron neuron = hiddenLayer.get(i);
                neuron.calculateValue(this);
    
                float value = neuron.calculateValue(this);
                float delta = correctOutput - value;
    
                //System.out.println("HIDDEN: " + neuron + " -> " + value + ", delta " + delta);
    
                neuron.adjustWeights(delta, this);
            }
        }

		boolean foundCorrect = true;
		for (int i=0; i<outputLayer.size(); i++) {
			Neuron neuron = outputLayer.get(i);
			float value = neuron.calculateValue(this);
			float delta = correctOutput - value;

			if (Math.abs(delta) >= 0.0001) foundCorrect = false;


			System.out.println("OUT: " + neuron + " ##################### -> " + value + ", delta " + delta);

			neuron.adjustWeights(delta, this);
		}

		return foundCorrect;
	}

	public float getBias() {
		return bias;
	}

	public void setBias(float bias) {
		this.bias = bias;
	}
}
