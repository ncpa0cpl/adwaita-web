/*
 * Box.js
 */

import cx from 'clsx'

function Box({
  children,
  className,
  inline,
  compact,
  fill,
  horizontal: horizontalValue,
  vertical,
  align,
  justify,
  space,
  ...rest
}) {
  const horizontal =
    horizontalValue === undefined && vertical === undefined ? true : horizontalValue
  return (
    <div
      className={cx(
        'Box',
        className,
        space ? `space-${space}` : undefined,
        typeof fill === 'string' ? `fill-${fill}` : fill ? 'fill' : undefined,
        { inline, compact, vertical, horizontal, align, justify }
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

function Fill({
  children,
  className,
  expandChildren,
  ...rest
}) {
  return (
    <div
      className={
        cx(
          'Box__fill',
          {
            'expand-children': expandChildren
          }
        )
      }
      {...rest}
    >
      {children}
    </div>
  )
}

Box.Fill = Fill

export default Box
