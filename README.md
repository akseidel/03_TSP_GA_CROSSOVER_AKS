## 03_TSP_GA_CROSSOVER_AKS

A Variation to Daniel Shiffman's 03_TSP_GA_Crossover in
Nature of Code: Intelligence and Learning
https://github.com/shiffman/NOC-S17-2-Intelligence-Learning.

This program develops solutions to the "Traveling Salesperson Problem" (TSP) using a genetic algorithm (GA) method. In the TSP there is a given set of "cities". The task is to find the shortest travel distance routing where the salesperson visits each city once, eventually returning to the starting city. The GA method maintains a population of routings that are initially chosen at random but then subsequently evolved from previous "better fitting" routings into newer populations using methods to emulate simple "genetic" reproduction while also introducing random changes.

Using the program from a biology viewpoint, the observer should abstract the salesperson routing solutions as representing different evolutionary stages to an organism evolving in an environment where having a lower distance traveled is an advantage.

The GA reproduction method in this program is crude compared to real life, but in its operation it does exhibit some evolution characteristics. This program is designed for someone to observe how the simple GA evolution proceeds in context with the TSP complexity, mutation rate and genetic population size. The observer can then recognize basic evolution concepts.

The following image shows the program in operation on a 20 city TSP routing. The canvas is divided into two sections top and bottom. The top section shows the previous "organisms". The bottom section shows the current "organism". Below the canvas are the program's control elements.

![ScreenShot](./images/ScreenShot01.png)

**Bottom Section** &mdash; By coincidence only, current organism shown in the bottom section is the 20th organism's evolved state. Each evolved state is when the route distance evolves to be smaller than the previous evolved distance. The 20th route distance is 1,776.91.

 That 1,776.91 distance is a 4.309% change from the previous 19th organism's distance. The evolution to the 20th state occurred with the 3,446,808th organism. The 11,270,000th organism existed when this image was captured. Incidentally, this batch evolved to the 22th organism at the time of this writing. The 22th change occurred at the 22,655,444 organism. The 21st evolution occurred at 12,194,103.

 **Top Section** &mdash; The top section shows the previous evolved state. This is the evolved state that the current evolved state bettered with a smaller distance. That previous 19th state occurred with the 1,618,710th organism and was a 0.305% "improvement" over the 18th state.

 The yellow curve in the top section represents the traveling distances for all the historical previous evolved states. The horizontal axis is the Nth member that possessed better minimum distance and the vertical axis represents the traveling distance. The small dots in curve are at each new state. This yellow curve is in essence an evolution time line showing how significant each change is relative to the **_past changes_**.

 The routes and data for all the previous evolved states will be displayed when the mouse is moved horizontally across the top section. At each previous state the yellow curve represents the evolution history **_up to the displayed historical state_**. In other words picking a place on the yellow curve to show a particular state **_is not going to show what you hope to see_**.

**The Controls**
* Button &ndash; Restart(New Routes etc.)
  - Restarts the evolution from scratch using the control settings indicated.
* Input &ndash; Number Of Cities
  - Sets the number of cities. This number must be 4 or larger.
* Input &ndash; Population Pool Size
  - The population size for the pool of travel route orders (i.e. organisms) upon which the GA reproduction is performed. Each member in the pool will be evaluated for distance and judged based upon distance. The pool is constantly being regenerated from members selected from the previous pool.
* Checkbox &ndash; Inject Wild DNA
  - When checked, one of the travel route order members used in the travel route order crossovers used to generate _one_ of next generation travel route pools will be "totally wild", i.e. a random travel order arrangement, instead of being a selection from the judged "evolved" pool normally used in the simulated reproduction algorithm.
* Slider &ndash; Random One Position Mutation Rate
  - Sets the rate (i.e. probability) that one pair of cities will be swapped in the route order of each population pool member.
