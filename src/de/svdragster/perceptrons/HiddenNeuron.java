package de.svdragster.perceptrons;

/**
 * Created by z003p2yd on 26.03.2018.
 */
public class HiddenNeuron extends Neuron {

	public HiddenNeuron(String name) {
		super(name);
	}

	@Override
	public void adjustWeights(float delta, Network network) {
		for (Connection connectionIn : input) {
			float changeInWeight = (float) (1 - Math.pow(value, 2));
			changeInWeight *= connectionIn.getWeight() * delta * learningRate;
			//changeInWeight *= connectionIn.getValue();

			System.out.println("Hidden change in weight: " + changeInWeight);

			connectionIn.setWeight(connectionIn.getWeight() - changeInWeight);
		}
		network.setBias(network.getBias() + learningRate * delta);
	}
}
