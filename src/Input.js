/*
 * Input.js
 */


import { useState, useRef, forwardRef } from 'react'
import cx from 'classname'
import Icon from './Icon'

function useForceUpdate(){
    const [_, setValue] = useState(0)
    return () => setValue(value => ++value)
}

function Input({
  type = 'text',
  className,
  icon,
  iconAfter,
  placeholder,
  flat,
  disabled,
  error,
  warning,
  progress,
  children,
  onChange,
  ...rest
}, ref) {

  const forceUpdate = useForceUpdate()
  const inputRef = useRef()
  const isControlled = typeof rest.value === 'string'
  const value = isControlled ? rest.value : (inputRef.current?.value || rest.defaultValue || '')

  const inputClassName =
    cx('Input', { flat, disabled, error, warning, progress: progress !== undefined })
    + ' ' + cx(className)

  const onInputChange = ev => {
    if (isControlled)
      onChange && onChange(ev.targer.value, ev)
    else
      forceUpdate()
  }

  return (
    <div className={inputClassName} ref={ref}>
      {icon &&
        <span  className='Input__left'>
          {
            typeof icon === 'string' ? 
              <Icon name={icon} /> :
              icon
          }
        </span>
      }
      <div className='Input__area'>
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={value === '' ? 'empty' : undefined}
          ref={inputRef}
          onChange={onInputChange}
          {...rest}
        />
        {children &&
          <div className='Input__children'>
            {children}
          </div>
        }
      </div>
      {progress &&
        <div className={cx('Input__progress', progress === true ? 'undeterminate' : undefined)}>
          <span
            className='Input__progress__bar'
            style={typeof progress === 'number' ? { width: progress + '%' } : undefined}
          />
        </div>
      }
      {iconAfter &&
        <span  className='Input__right'>
          {
            typeof iconAfter === 'string' ? 
              <Icon name={iconAfter} /> :
              iconAfter
          }
        </span>
      }
    </div>
  )
}

function Group({ children, className }, ref) {
  return (
    <div className={cx('InputGroup linked', className)} ref={ref}>
      {children}
    </div>
  )
}

const ExportedInput = forwardRef(Input)
ExportedInput.Group = forwardRef(Group)

export default ExportedInput
