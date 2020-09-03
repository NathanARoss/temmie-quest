async function main() {
	while(true) {

		println("");
		
		print("Please enter your name: ")
		const name = await readString("Name", true);
		println(name); // reading input doesn't automatically print it
		
		print("Please enter your age: ");
		const age = await readNumber("Age", 0, 120, 1);
		println(age);
		
		println(`\nHello ${name}, age ${age}, nice to meet you.`);
		println("How confident do you feel?");
		
		let confidence = 0;
		while (confidence < 66) {
			confidence = await readNumberWithSlider(0, 100, 1);
			if (confidence < 33) {
				println(`A confidence of ${confidence} isn't very high. Are you okay?`);
			} else if (confidence < 66) {
				println(`A confidence of ${confidence} is pretty average. Let's try this again.`);
			} else {
				println(`A confidence of ${confidence} is pretty confident. Now we're talking!`);
			}
		}
		
		while(true) {
			println("\nYou check your inventory. Which items would you like to consume?");
			const items = await readCheckboxSelections(["Apple", "Sandwich", "Water"]);
			
			if (items.length == 0 || items.length == 1 && items[0] == "Water") {
				println("You die of starvation");
			}
			
			if (! items.includes("Water")) {
				println("You die of thirst");
			}
			
			if (items.length == 3) {
				println("You ate too much and exploded");
			}
			
			if (items.length == 2 && items.includes("Water")) {
				println("Your balanced meal allows you to regain your energy. You continue onward.")
			break;
		}

		println("You use your time traveling abilities to try again.");
	}
	
	println("\nYou come across the Shrine of Temmie.");
	
	hasPrayed = false;
	while (!hasPrayed) {
		println("What do you do?");
		const action = await readButtonSelection(["Pray", "Run away", "Take a nap"]);
		
		switch (action) {
			case "Pray":
				println("You feel the weight of the world melt away and you transcend the limts of your own mind.\n");
				hasPrayed = true;
				break;
			case "Run away":
				println("A large boulder lands on your head, killing you instantly.")
				println("You use your time traveling ability to try again.\n");
				break;
			case "Take a nap":
				println("You awake feeling refreshed and appreciated for who you are.\n")
				break;
			}
		}
				
		println("Congratulations on enlightenment. You may now change the terminal color.")
		const color = await readColor("#000000");
		document.body.style.backgroundColor = color;
		
		const replay = await readButtonSelection(["Play again", "Quit"]);
		if (replay == "Quit") {
			break;
		}
		
		clear();
	}
}

main();