import React, { useState, useEffect } from 'react';
import { 
  MdKeyboardArrowDown,
  MdCheck,
  MdRemove
} from 'react-icons/md';

import data from './data.json';

import { 
  Container,
  CheckboxContainer,
  CheckboxContent,
  Checkbox
} from './styles';

function App() {
  const [values, setValues] = useState([]);
  const [updateComponent, setUpdateComponent] = useState(false);

  /**
   * Ao carregar o componente, é transformado em array os dados das chaves pais do arquivo data.json
   */
  useEffect(() => {
    function bootApplication() {
      // Caso não exita os valores criados no localStorage eles são criados, caso contrário eles são pegos para setar no estado values
      if (!localStorage.getItem('data')) {
        let array = [];
        Object.keys(data).forEach(key => {
          array.push(data[key]);
        });
        localStorage.setItem('data', JSON.stringify(array));
        setValues(array);
      } else {
        let storage = localStorage.getItem('data');
        setValues(JSON.parse(storage));
      }
    }

    bootApplication();
  }, []);

  /**
   * Sempre que o estado updateComponente sofre uma atualização, é renderizado o componente
   */
  useEffect(() => {
  }, [updateComponent]);

  /**
   * Transforma em array os dados dos filhos passado por parâmetro
   * @param children 
   */
  function handleFormatChildKeys(children) {
    let arrayChildren = [];
    Object.keys(children).forEach(key => {
      arrayChildren.push(children[key]);
    });
    return arrayChildren;
  }
  
  /**
   * Controla a árvore de elementos
   * @param children 
   * @param fatherPosition 
   */
  function handleTree(children, fatherPosition) {
    let arrayChildren = handleFormatChildKeys(children);
    if (arrayChildren.length === 0) {
      return;
    }

    // Se o pai já estiver expandido, será removido os filhos, caso contrário, será exibido os filhos
    if (values[fatherPosition].expanded === true) {
      handleHideChildren(fatherPosition);
    } else {
      handleShowChildren(fatherPosition, arrayChildren);
    }
  }

  /**
   * Exibe os filhos conforme a posição do pai passado por parâmetro
   * @param fatherPosition 
   * @param arrayChildren 
   */
  function handleShowChildren(fatherPosition, arrayChildren) {
    values[fatherPosition].expanded = !values[fatherPosition].expanded;
    
    let childrenPosition = fatherPosition + 1;

    for (let index = 0; index < arrayChildren.length; index++) {
      const children = arrayChildren[index];
      children.expanded = false;
      children.checked = false;
      children.unchecked = false;
      if (values[fatherPosition].checked && !values[fatherPosition].unchecked) {
        children.checked = true;
      }
      // Insere no array os filhos do pai
      values.splice(childrenPosition++, 0, children);
    }

    handleUpdateComponent();
  }

  /**
   * Esconde os filhos conforme a posição do pai passado por parâmetro
   * @param fatherPosition 
   */
  function handleHideChildren(fatherPosition) {
    values[fatherPosition].expanded = !values[fatherPosition].expanded;
    
    let totalItemsToRemove = 0;
    let childrenPosition = fatherPosition + 1;

    for (let index = childrenPosition; index < values.length; index++) {
      const children = values[index];
      if (children.level >  values[fatherPosition].level) {
        children.expanded = false;
        children.checked = false;
        children.unchecked = false;
        totalItemsToRemove++;
      } else {
        // Encontrou um item do mesmo nível do pai
        break;
      } 
    }

    // Remove do array os filhos do pai, passando a posição do primeiro filho e o total de itens para remover a partir da posição
    values.splice(childrenPosition, totalItemsToRemove);

    handleUpdateComponent();
  }

  /**
   * Controla os checkbox dos níveis
   * @param fatherPosition 
   */
  function handleCheckFather(fatherPosition) {
    if (values[fatherPosition].level > 0) {
      if (values[fatherPosition].unchecked && values[fatherPosition].checked) {
        values[fatherPosition].unchecked = false;
      } else {
        values[fatherPosition].checked = !values[fatherPosition].checked;
      }

      handleTopFather(fatherPosition);
     
    } else {
      if (values[fatherPosition].checked && values[fatherPosition].unchecked) {
        values[fatherPosition].unchecked = false;
      } else {
        values[fatherPosition].checked = !values[fatherPosition].checked;
      }
    }
    
    handleCheckChildren(fatherPosition);
    
    handleUpdateComponent();
  }

  /**
   * Verifica se existe um pai de um nível superior
   * @param fatherPosition 
   */
  function handleTopFather(fatherPosition) {
    for (let index = fatherPosition; index < values.length; index--) {
      const father = values[index];
      if (father.level === values[fatherPosition].level - 1) {
        if (father.checked) {
          father.unchecked = true;
        } else {
          father.checked = true;
          father.unchecked = true;
        }
        break;
      }
    }
  }
  
  /**
   * Se o pai estiver expandido, vai marcar ou desmarcar todos os filhos do pai passado por parâmetro
   * @param fatherPosition 
   */
  function handleCheckChildren(fatherPosition) {
    if (values[fatherPosition].expanded) {
      let childrenPosition = fatherPosition + 1;
      for (let index = childrenPosition; index < values.length; index++) {
        const children = values[index];
        if (children.level > values[fatherPosition].level) {
          if (values[fatherPosition].checked) {
            children.checked = !children.checked ? !children.checked : true;
            children.unchecked = false;
          } else {
            children.checked = false;
          }
        } else {
          break;
        }
      }
    }
  }

  /**
   * Responsável por ficar atualizando o componente
   */
  function handleUpdateComponent() {
    localStorage.setItem('data', JSON.stringify(values));
    setValues(values);
    setUpdateComponent(!updateComponent);
  }
  
  return (
    <Container>
      <h1>Tree component</h1>
      <main>
        <ul>
          {
            values.map((item, index) => {
              return (
                <CheckboxContainer key={item.id}>
                  <CheckboxContent marginLeft={item.level * 1.5}>
                    <Checkbox 
                      className={item.checked ? 'checked' : ''} 
                      onClick={() => handleCheckFather(index)}
                    >
                      { item.checked && !item.unchecked ?
                        <MdCheck /> 
                        :
                        item.checked && item.unchecked &&
                        <MdRemove />
                      }
                    </Checkbox>

                    <label 
                      onClick={() => handleCheckFather(index)}
                    >
                      {item.name}
                    </label>

                    { item.children[0] &&
                      <MdKeyboardArrowDown 
                        className={item.expanded ? 'expanded' : ''} 
                        onClick={() => handleTree(item.children, index)} 
                      />
                    }
                    
                  </CheckboxContent>
                </CheckboxContainer>
              );
            })
          }
        </ul>
      </main>
    </Container>
  );
}

export default App;
