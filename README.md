#[`demonstration of the project`](http://billautomata.github.io/piday_2015/)

## `What am I doing here?`

My `π-day` project is a simple application that tests the randomness of a stream of numbers by using them to approximate π.

## `How am I doing it?`

The algorithm I use is based on a principle used in the [Monte Carlo](http://en.wikipedia.org/wiki/Monte_Carlo_method) simulation technique for numerical integration.

1. Pick a random point `p` in a box where `x = -1 to 1`, and `y = -1 to 1`
2. Find the distance of `p` from the origin `[0,0]` using the distance formula derived from pythagorean theorem.
3. If the `distance > 1.0`, mark the `p` as outside
4. If the `distance is <= 1.0`, mark `p` as inside

After enough iterations of the above algorithm you should have a count of points marked as `inside` and a count of `total elements` you have checked.  

If your points were evenly distributed your ratio should be `π/4`.

```
count of points marked as inside
-------------------------------- = (π/4) or ~0.7854
          total count
```

## `Why?`

When we were calculating the distances above, we were actually checking to see if that point  `p` fell within a circle inscribed in the box we have been plotting all of our points.

The area of a square with the **side length** of `1.0m` is `1.0 m^2`.

![screen shot 2015-03-14 at 4 22 41 pm](https://cloud.githubusercontent.com/assets/432483/6654009/6447b6e0-ca66-11e4-9cfb-d151b01a5180.png)


The area of a circle with the **diameter** of `1.0m` (radius of `0.5m`) is `~0.7854 m^2`.

![screen shot 2015-03-14 at 3 00 23 pm](https://cloud.githubusercontent.com/assets/432483/6653748/ecb2c986-ca5a-11e4-947d-9bf4afa4f450.png)

The ratio of the area of the circle to the area of the square is `0.7854:1`

If our random numbers were evenly distributed there should be `~79` points that fall within the circle for every `100` points placed in the box.

If the numbers are not evenly distributed the ratio will be different than `~79:100`.

## `How does this method approximate π?`

If numbers are sufficiently random, then your ratio of points inside the circle to the total number of points should be a number near `π/4`.  

If you multiply `(π/4)` by `4` you are left with `π`.

If your numbers were perfectly random and you performed this calculation on an infinite number of them, you would have a pretty great numerical approximation of `π`.

Thanks to [John Brown](https://twitter.com/thisisjohnbrown) for organizing the [event](http://www.meetup.com/PDX-Creative-Coders/events/220810977/) for PDX Creative Coders.
