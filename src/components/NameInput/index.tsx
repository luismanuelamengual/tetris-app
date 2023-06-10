import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import './index.scss';

interface Props {
  charactersCount?: number;
  value?: string;
  onChange?: ((value: string) => void) | null
};

export function NameInput({ charactersCount = 3, value = '', onChange = null }: Props) {
  const [characters, setCharacters] = useState<Array<number>>([]);
  const [cursorIndex, setCursorIndex] = useState<number>(0);

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'Backspace':
        if (cursorIndex > 0) {
          setCharacters((characters) => {
            const newCharacters = [...characters];
            newCharacters.splice(cursorIndex - 1, 1);
            return newCharacters;
          });
          setCursorIndex((cursorIndex) => cursorIndex > 0 ? (cursorIndex - 1) : cursorIndex);
        }
        break;
      case 'Delete':
        if (cursorIndex < characters.length) {
          setCharacters((characters) => {
            const newCharacters = [...characters];
            newCharacters.splice(cursorIndex, 1, 32);
            return newCharacters;
          });
        }
        break;
      case 'ArrowLeft':
        setCursorIndex((cursorIndex) => cursorIndex > 0 ? (cursorIndex - 1) : cursorIndex);
        break;
      case 'ArrowRight':
        setCursorIndex((cursorIndex) => cursorIndex < (charactersCount-1) ? (cursorIndex + 1) : cursorIndex);
        break;
      default:
        if (cursorIndex < charactersCount) {
          const { key, code } = event;
          const regex = /^[a-z]|[A-Z]$/;
          if (code === 'Space' || regex.test(key)) {
            const character = key.toUpperCase().charCodeAt(0);
            setCharacters((characters) => {
              const newCharacters = [...characters];
              newCharacters[cursorIndex] = character;
              return newCharacters;
            });
            setCursorIndex(cursorIndex => cursorIndex + 1);
          }
        }
        break;
    }
  };

  const renderSlots = useCallback(() => {
    const divs = [];
    for (let i = 0; i < charactersCount; i++) {
      divs.push(<div key={i} className={classNames({
        'key-slot': true,
        'key-slot-cursor': cursorIndex == i
      })} onClick={() => setCursorIndex(i)}>{i < characters.length ? String.fromCharCode(characters[i]) : ' '}</div>);
    }
    return divs;
  }, [characters, charactersCount, cursorIndex]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(() => {
    const newCharacters = [];
    for (let i = 0; i < Math.min(value.length, charactersCount); i++) {
      newCharacters.push(value.charCodeAt(i));
    }
    setCharacters(newCharacters);
  }, [value]);

  useEffect(() => {
    if (onChange != null) {
      onChange(String.fromCharCode.apply(null, characters));
    }
  }, [characters]);

  return <div className='name-input'>
    {renderSlots()}
  </div>;
}