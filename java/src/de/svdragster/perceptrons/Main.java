package de.svdragster.perceptrons;

import java.util.Arrays;
import java.util.Scanner;

/**
 * Created by z003p2yd on 26.03.2018.
 */
public class Main {

	public Main() {

	}

	public static void main(String[] args) {
		new Main();

		Network network = new Network();

		float[] correctOutputs = new float[]{
				-1,
				1,
				1,
				-1
		};

		float[][] inputs = new float[][] {
				{-1, -1},
				{-1, 1},
				{1, -1},
				{1, 1}
		};

		String line;
		do {
			Scanner scanner = new Scanner(System.in);
			System.out.println("####### Write exit to exit #######");
			line = scanner.nextLine();
			if (line.equalsIgnoreCase("exit")) {
				break;
			}

			boolean done = true;

			for (int i=0; i<inputs.length; i++) {
				System.out.println("INPUT -- " + Arrays.toString(inputs[i]));

				if (!network.calculate(inputs[i], correctOutputs[i])) {
					done = false;
				}
			}

			if (done) {
				System.out.println(" ------- ---- -------");
				System.out.println(" ------- DONE -------");
				System.out.println(" ------- ---- -------");
				break;
			}

		} while(true);
	}



}
