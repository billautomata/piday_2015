### What am I doing here?

My `π-day` project is a simple application that test the randomness of a stream of numbers by using them to approximate π.

### How am I doing it?

The algorithm I use is based on a principle from the Monte Carlo Simulation technique.

1. Pick a random point in a box where `x = -1 to 1`, and `y = -1 to 1`
2. Find the distance of that point from the origin `[0,0]` using the distance formula derived from pythagorean theorem.
3. If the `distance > 1.0`, mark the point as outside
4. If the `distance is <= 1.0`, mark the point as inside

After enough iterations of the above algorithm you should have a count of elements with a `distance less than one` and a count of `total elements`.  

If your points were evenly distributed your ratio should be `π/4`.

```
count of points marked as inside
-------------------------------- = (π/4)
          total count
```

### Why?  

When we were calculating the distance from the origin of the random point was greater than zero, we were actually checking to see if that point fell within a circle inscribed in the box we have been plotting our points.

The area of a square with the **side length** of `1.0m` is `1.0 m^2`.

The area of a circle with the **diameter** of `1.0m` is `~0.7854 m^2`.

![screen shot 2015-03-14 at 3 00 23 pm](https://cloud.githubusercontent.com/assets/432483/6653748/ecb2c986-ca5a-11e4-947d-9bf4afa4f450.png)


If our random numbers were evenly distributed there should be `~79` points that fall within the circle for every `100` points.  

If the numbers are not evenly distributed the ratio will be different than `~79/100`.

### How does this method approximate π?

If you think your numbers are sufficiently random, then your ratio of points inside the circle to the total number of points should be a number that approaches `π/4`.  

If you multiply `(π/4)` by `4` you are left with `π`.

If your numbers were perfectly random and you performed this calculation on an infinite number of them, you would have a pretty great numerical approximation of `π`.

Thanks to [John Brown](https://twitter.com/thisisjohnbrown) for organizing the [event](http://www.meetup.com/PDX-Creative-Coders/events/220810977/) for PDX Creative Coders.
