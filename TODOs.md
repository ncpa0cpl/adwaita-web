1. Document all the components and the props, rn some are documented well, some documented poorly and some are not documented at all (jsdoc)
2. Create examples for all the components, some already have those.
3. Deep checksum comparison for typedoc generation script (currently the script will use the cached results for components which file did not change, this means that any changes in the files on which the component depends wont invalidate the cache) ((this is not crucial since on release docs are generated on a clean docker container with nothing cached beforehand))
4. Rewrite Range component
5. Fix the table component
