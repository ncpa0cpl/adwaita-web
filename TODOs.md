1. Add support for auto-generating documentation for types that use TS Utilities like Omit, Excludes, Record, etc.
2. Document all the components and the props, rn some are documented well, some documented poorly and some are not documented at all (jsdoc)
3. Create examples for all the components, some already have those.
4. Deep checksum comparison for typedoc generation script (currently the script will use the cached results for components which file did not change, this means that any changes in the files on which the component depends wont invalidate the cache) ((this is not crucial since on release docs are generated on a clean docker container with nothing cached beforehand))
5. Optimize stylesheet's size. Currently a lot of css variables are generated that are not used in the final stylesheet. Optimization should take the generated variables and the stylesheet, check which variables are not used and delete them (all that should happen post compilation).
6. Rewrite Range component
7. Fix the table component
