Sometimes, scanned pages open a new window (tab) and communicate with that window using postMessage.

Explorer assumes a PageScan takes place in a single window.

A lot of things are based on that assumption, and if it breaks a lot of code would need to be rewritten and new problems would need to be solved.

1. Windows are preconfigured before they are navigated.
	1. There is no system of preconfiguring another window to be part of the scan.
	2. The window would need to be “caught” before it loads and configured. While that doesn’t sound impossible, it also sounds hard.
2. UJ commands are executed against a single window.
	1. There would need to be a system for picking which window to run commands on.
	1. A system for debugging a UJ across multiple windows
3. The scan is composed of PageTransitions that happen in sequence, and one needs to end before another can begin.
	1. Explorer uses this when processing the data. Having two windows running in parallel breaks this assumption and would require extra data processing code.
4. There is no window management component, which would be required.

There would also be a large-scale change to the data that would affect the rest of the system. It’s unclear how the secondary window should be treated. 

# Solution
The solution is to avoid solving the hard problem. Sometimes we can’t do that, but in this case we can.

# FakeNavigate
The `FakeNavigation` command takes another command (can be a block) as a parameter and changes the page environment until the command ends.

1. Executing the command spawns an (at first invisible) iframe. The `options` determine the iframe geometry, with options to cover the entire page or something else.
3. The command configures `window.open` to work by loading the requested page in the iframe and returning the iframe as a `window` object.
4. The iframe is configured so it believes it’s another window. It receives a reference to the frame that spawned it as a window object.
5. The UJ can then interact with the iframe.
6. When the command ends, the iframe is destroyed.

While this command is active, the `GetLastEvent` command should throw an error (?)

This allows the “windows” to interact with each other as though they were separate, but without introducing the complications of actually having separate windows.

This allows both pages to run at the same time and talk to each other.

Multiple such commands could be executed, which would result in a stack of frames opening. 