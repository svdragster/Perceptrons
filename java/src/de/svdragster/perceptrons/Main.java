package de.svdragster.perceptrons;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

/**
 * Created by Sven on 26.03.2018.
 */
public class Main extends JFrame {
    
    JTextArea outputTextArea;
    
    float[] correctOutputs;
    float[][] inputs;
    
    BufferedImage[] inputImages;
    
    Network network;
    
	public Main() {
        /*correctOutputs = new float[]{
                -1,
                1,
                -1,
                -1
        };
        
        inputs = new float[][] {
                {-1, -1},
                {-1, 1},
                {1, -1},
                {1, 1}
        };*/
        
        try {
            inputImages[0] = ImageIO.read(new File("plus.bmp"));
            inputImages[1] = ImageIO.read(new File("minus.bmp"));
        } catch (IOException e) {
            e.printStackTrace();
        }
	}

	public static void main(String[] args) {
		Main frame = new Main();
        frame.setTitle("Perceptrons");
        frame.setSize(1000, 620);
        frame.setResizable(false);
        frame.setLocation(100, 100);
        frame.setVisible(true);
        frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        frame.initComponents();
	}
	
	public void startNetwork() {
        
        
        
        //String line;
        
        MainLoop:
        do {
            /*Scanner scanner = new Scanner(System.in);
            System.out.println("####### Write exit to exit #######");
            line = scanner.nextLine();
            if (line.equalsIgnoreCase("exit")) {
                break;
            }*/
            
            for (int calcs=0; calcs<100; calcs++) {
                boolean done = true;
                
                for (int i = 0; i < inputs.length; i++) {
                    //System.out.println(calcs + " INPUT -- " + Arrays.toString(inputs[i]));
                    //outputTextArea.append(calcs + " INPUT -- " + Arrays.toString(inputs[i]) + "\n");
                    outputTextArea.append(calcs + " INPUT ----- " + i + " -------------\n");
                    if (!network.calculate(inputs[i], correctOutputs[i])) {
                        done = false;
                    }
                    
                    StringBuilder builder = new StringBuilder();
                    int outputCounter = 0;
                    for (Neuron output : network.outputLayer.getNeurons()) {
                        builder.append(outputCounter).append("(").append(output.getValue()).append(")  ");
                        outputCounter++;
                    }
                    builder.append("\n");
                    outputTextArea.append(builder.toString());
                }
                
                if (done) {
                    System.out.println(" ------- ---- -------");
                    System.out.println(" ------- DONE -------");
                    System.out.println(" ------- ---- -------");
                    outputTextArea.append(" ------- ---- -------\n");
                    outputTextArea.append(" ------- DONE -------\n");
                    outputTextArea.append(" ------- ---- -------\n");
                    break MainLoop;
                }
            }
            
        } while(true);
    }
	
	public void initComponents() {
        //Creating the MenuBar and adding components
        JMenuBar mb = new JMenuBar();
        JMenu m1 = new JMenu("FILE");
        JMenu m2 = new JMenu("Help");
        mb.add(m1);
        mb.add(m2);
        JMenuItem m11 = new JMenuItem("Open");
        JMenuItem m22 = new JMenuItem("Save as");
        m1.add(m11);
        m1.add(m22);
        
        //Creating the panel at bottom and adding components
        JPanel panel = new JPanel(); // the panel is not visible in output
        JLabel label = new JLabel("Enter Text");
        //JTextField tf = new JTextField(10); // accepts upto 10 characters
        JButton createNetwork = new JButton("Create Network");
        createNetwork.addActionListener(actionListener -> {
            network = new Network(inputImages[0].getWidth() * inputImages[0].getHeight(), inputImages.length + 1);
        });
        JButton start = new JButton("Start");
        start.addActionListener(actionListener -> {
            startNetwork();
        });
        //JButton reset = new JButton("Reset");
        panel.add(label); // Components Added using Flow Layout
        panel.add(label); // Components Added using Flow Layout
        //panel.add(tf);
        panel.add(start);
        //panel.add(reset);
        
        // Text Area at the Center
        outputTextArea = new JTextArea();
        JScrollPane scroll = new JScrollPane(outputTextArea);
        scroll.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_ALWAYS);
        
        
        //Adding Components to the frame.
        this.getContentPane().add(BorderLayout.SOUTH, panel);
        this.getContentPane().add(BorderLayout.NORTH, mb);
        this.getContentPane().add(BorderLayout.CENTER, scroll);
        this.setVisible(true);
    }



}
