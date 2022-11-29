import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Tree from './components/Tree';
import data from './data/data.json';
import { AppContext } from './contex/contextApi';

function App() {
  //Create a HTML element specified by parameter 'p_type'
  useEffect(() => {
    readyTreeView()
  });

  function createSimpleElement(p_type, p_id, p_class) {
    let element = document.createElement(p_type);
    if (p_id != undefined) element.id = p_id;
    if (p_class != undefined) element.className = p_class;
    return element;
  }

  //Create img element
  function createImgElement(p_id, p_class, p_src) {
    let element = document.createElement("img");
    if (p_id != undefined) element.id = p_id;
    if (p_class != undefined) element.className = p_class;
    if (p_src != undefined) element.src = p_src;
    return element;
  }

  function createTree(p_div=null, p_backColor=null, p_contextMenu=null) {
    var tree = {
      name: 'tree',
      div: p_div,
      ulElement: null,
      childNodes: [],
      backcolor: p_backColor,
      contextMenu: p_contextMenu,
      selectedNode: null,
      nodeCounter: 0,
      contextMenuDiv: null,
      rendered: false,
      ///// Creating a new node
      // p_text: Text displayed on the node;
      // p_expanded: True or false, indicating wether the node starts expanded or not;
      // p_icon: Relative path to the icon displayed with the node. Set null if the node has no icon;
      // p_parentNode: Reference to the parent node. Set null to create the node on the root;
      // p_tag: Tag is used to store additional information on the node. All node attributes are visible when programming events and context menu actions;
      // p_contextmenu: Name of the context menu, which is one of the attributes of the p_contextMenu object created with the tree;
      createNode: function (p_text, p_expanded, p_icon, p_parentNode, p_tag, p_contextmenu) {
        let v_tree = this;
        let node = {
          id: 'node_' + this.nodeCounter,
          text: p_text,
          icon: p_icon,
          parent: p_parentNode,
          expanded: p_expanded,
          childNodes: [],
          tag: p_tag,
          contextMenu: p_contextmenu,
          elementLi: null,
          ///// Removing the node and all its children
          removeNode: function () { v_tree.removeNode(this); },
          ///// Expanding or collapsing the node, depending on the expanded value
          toggleNode: function (p_event) { v_tree.toggleNode(this); },
          ///// Expanding the node
          expandNode: function (p_event) { v_tree.expandNode(this); },
          ///// Expanding the node and its children recursively
          expandSubtree: function () { v_tree.expandSubtree(this); },
          ///// Changing the node text
          // p_text: New text;
          setText: function (p_text) { v_tree.setText(this, p_text); },
          ///// Collapsing the node
          collapseNode: function () { v_tree.collapseNode(this); },
          ///// Collapsing the node and its children recursively
          collapseSubtree: function () { v_tree.collapseSubtree(this); },
          ///// Deleting all child nodes
          removeChildNodes: function () { v_tree.removeChildNodes(this); },
          ///// Creating a new child node;
          // p_text: Text displayed;
          // p_expanded: True or false, indicating wether the node starts expanded or not;
          // p_icon: Icon;
          // p_tag: Tag;
          // p_contextmenu: Context Menu;
          createChildNode: function (p_text, p_expanded, p_icon, p_tag, p_contextmenu) { return v_tree.createNode(p_text, p_expanded, p_icon, this, p_tag, p_contextmenu); }
        }

        this.nodeCounter++;

        if (this.rendered) {
          if (p_parentNode == undefined) {
            this.drawNode(this.ulElement, node);
            this.adjustLines(this.ulElement, false);
          }
          else {
            var v_ul = p_parentNode.elementLi.getElementsByTagName("ul")[0];
            if (p_parentNode.childNodes.length == 0) {
              if (p_parentNode.expanded) {
                p_parentNode.elementLi.getElementsByTagName("ul")[0].style.display = 'block';
                let v_img = p_parentNode.elementLi.getElementsByTagName("img")[0];
                v_img.style.visibility = "visible";
                v_img.src = 'images/collapse.png';
                v_img.id = 'toggle_off';
              }
              else {
                p_parentNode.elementLi.getElementsByTagName("ul")[0].style.display = 'none';
                let v_img = p_parentNode.elementLi.getElementsByTagName("img")[0];
                v_img.style.visibility = "visible";
                v_img.src = 'images/expand.png';
                v_img.id = 'toggle_on';
              }
            }
            this.drawNode(v_ul, node);
            this.adjustLines(v_ul, false);
          }
        }

        if (p_parentNode == undefined) {
          this.childNodes.push(node);
          node.parent = this;
        }
        else
          p_parentNode.childNodes.push(node);

        return node;
      },
      ///// Render the tree;
      drawTree: function () {

        this.rendered = true;

        var div_tree = document.getElementById(this.div);
        div_tree.innerHTML = '';

        let ulElement = createSimpleElement('ul', this.name, 'tree');
        this.ulElement = ulElement;

        for (var i = 0; i < this.childNodes.length; i++) {
          this.drawNode(ulElement, this.childNodes[i]);
        }

        div_tree.appendChild(ulElement);

        this.adjustLines(document.getElementById(this.name), true);

      },
      ///// Drawing the node. This function is used when drawing the Tree and should not be called directly;
      // p_ulElement: Reference to the UL tag element where the node should be created;
      // p_node: Reference to the node object;
      drawNode: function (p_ulElement, p_node) {

        let v_tree = this;

        var v_icon = null;

        if (p_node.icon != null)
          v_icon = createImgElement(null, 'icon_tree', p_node.icon);

        var v_li = document.createElement('li');
        p_node.elementLi = v_li;

        var v_span = createSimpleElement('span', null, 'node');

        var v_exp_col = null;

        if (p_node.childNodes.length == 0) {
          v_exp_col = createImgElement('toggle_off', 'exp_col', 'images/collapse.png');
          v_exp_col.style.visibility = "hidden";
        }
        else {
          if (p_node.expanded) {
            v_exp_col = createImgElement('toggle_off', 'exp_col', 'images/collapse.png');
          }
          else {
            v_exp_col = createImgElement('toggle_on', 'exp_col', 'images/expand.png');
          }
        }

        v_span.ondblclick = function () {
          v_tree.doubleClickNode(p_node);
        };

        v_exp_col.onclick = function () {
          v_tree.toggleNode(p_node);
        };

        v_span.onclick = function () {
          v_tree.selectNode(p_node);
        };

        v_span.oncontextmenu = function (e) {
          v_tree.selectNode(p_node);
          v_tree.nodeContextMenu(e, p_node);
        };

        if (v_icon != undefined)
          v_span.appendChild(v_icon);

        let v_a = createSimpleElement('a', null, null);
        v_a.innerHTML = p_node.text;
        v_span.appendChild(v_a);
        v_li.appendChild(v_exp_col);
        v_li.appendChild(v_span);

        p_ulElement.appendChild(v_li);

        var v_ul = createSimpleElement('ul', 'ul_' + p_node.id, null);
        v_li.appendChild(v_ul);

        if (p_node.childNodes.length > 0) {

          if (!p_node.expanded)
            v_ul.style.display = 'none';

          for (var i = 0; i < p_node.childNodes.length; i++) {
            this.drawNode(v_ul, p_node.childNodes[i]);
          }
        }
      },
      ///// Changing node text
      // p_node: Reference to the node that will have its text updated;
      // p_text: New text;
      setText: function (p_node, p_text) {
        p_node.elementLi.getElementsByTagName('span')[0].lastChild.innerHTML = p_text;
        p_node.text = p_text;
      },
      ///// Expanding all tree nodes
      expandTree: function () {
        for (var i = 0; i < this.childNodes.length; i++) {
          if (this.childNodes[i].childNodes.length > 0) {
            this.expandSubtree(this.childNodes[i]);
          }
        }
      },
      ///// Expanding all nodes inside the subtree that have parameter 'p_node' as root
      // p_node: Subtree root;
      expandSubtree: function (p_node) {
        this.expandNode(p_node);
        for (var i = 0; i < p_node.childNodes.length; i++) {
          if (p_node.childNodes[i].childNodes.length > 0) {
            this.expandSubtree(p_node.childNodes[i]);
          }
        }
      },
      ///// Collapsing all tree nodes
      collapseTree: function () {
        for (var i = 0; i < this.childNodes.length; i++) {
          if (this.childNodes[i].childNodes.length > 0) {
            this.collapseSubtree(this.childNodes[i]);
          }
        }
      },
      ///// Collapsing all nodes inside the subtree that have parameter 'p_node' as root
      // p_node: Subtree root;
      collapseSubtree: function (p_node) {
        this.collapseNode(p_node);
        for (var i = 0; i < p_node.childNodes.length; i++) {
          if (p_node.childNodes[i].childNodes.length > 0) {
            this.collapseSubtree(p_node.childNodes[i]);
          }
        }
      },
      ///// Expanding node
      // p_node: Reference to the node;
      expandNode: function (p_node) {
        if (p_node.childNodes.length > 0 && p_node.expanded == false) {
          if (this.nodeBeforeOpenEvent != undefined)
            this.nodeBeforeOpenEvent(p_node);

          var img = p_node.elementLi.getElementsByTagName("img")[0];

          p_node.expanded = true;

          img.id = "toggle_off";
          img.src = 'images/collapse.png';
          let elem_ul = img.parentElement.getElementsByTagName("ul")[0];
          elem_ul.style.display = 'block';

          if (this.nodeAfterOpenEvent != undefined)
            this.nodeAfterOpenEvent(p_node);
        }
      },
      ///// Collapsing node
      // p_node: Reference to the node;
      collapseNode: function (p_node) {
        if (p_node.childNodes.length > 0 && p_node.expanded == true) {
          var img = p_node.elementLi.getElementsByTagName("img")[0];

          p_node.expanded = false;
          if (this.nodeBeforeCloseEvent != undefined)
            this.nodeBeforeCloseEvent(p_node);

          img.id = "toggle_on";
          img.src = 'images/expand.png';
          let elem_ul = img.parentElement.getElementsByTagName("ul")[0];
          elem_ul.style.display = 'none';

        }
      },
      ///// Toggling node
      // p_node: Reference to the node;
      toggleNode: function (p_node) {
        if (p_node.childNodes.length > 0) {
          if (p_node.expanded)
            p_node.collapseNode();
          else
            p_node.expandNode();
        }
      },
      ///// Double clicking node
      // p_node: Reference to the node;
      doubleClickNode: function (p_node) {
        this.toggleNode(p_node);
      },
      ///// Selecting node
      // p_node: Reference to the node;
      selectNode: function (p_node) {
        var span = p_node.elementLi.getElementsByTagName("span")[0];
        span.className = 'node_selected';
        if (this.selectedNode != null && this.selectedNode != p_node)
          this.selectedNode.elementLi.getElementsByTagName("span")[0].className = 'node';
        this.selectedNode = p_node;
      },
      ///// Deleting node
      // p_node: Reference to the node;
      removeNode: function (p_node) {
        var index = p_node.parent.childNodes.indexOf(p_node);

        if (p_node.elementLi.className == "last" && index != 0) {
          p_node.parent.childNodes[index - 1].elementLi.className += "last";
          p_node.parent.childNodes[index - 1].elementLi.style.backgroundColor = this.backcolor;
        }

        p_node.elementLi.parentNode.removeChild(p_node.elementLi);
        p_node.parent.childNodes.splice(index, 1);

        if (p_node.parent.childNodes.length == 0) {
          var v_img = p_node.parent.elementLi.getElementsByTagName("img")[0];
          v_img.style.visibility = "hidden";
        }

      },
      ///// Deleting all node children
      // p_node: Reference to the node;
      removeChildNodes: function (p_node) {

        if (p_node.childNodes.length > 0) {
          var v_ul = p_node.elementLi.getElementsByTagName("ul")[0];

          var v_img = p_node.elementLi.getElementsByTagName("img")[0];
          v_img.style.visibility = "hidden";

          p_node.childNodes = [];
          v_ul.innerHTML = "";
        }
      },
      ///// Rendering context menu when mouse right button is pressed over a node. This function should no be called directly
      // p_event: Event triggered when right clicking;
      // p_node: Reference to the node;
      nodeContextMenu: function (p_event, p_node) {
        if (p_event.button == 2) {
          p_event.preventDefault();
          p_event.stopPropagation();
          if (p_node.contextMenu != undefined) {

            let v_tree = this;

            var v_menu = this.contextMenu[p_node.contextMenu];

            var v_div;
            if (this.contextMenuDiv == null) {
              v_div = createSimpleElement('ul', 'ul_cm', 'menu');
              document.body.appendChild(v_div);
            }
            else
              v_div = this.contextMenuDiv;

            v_div.innerHTML = '';

            var v_left = p_event.pageX - 5;
            var v_right = p_event.pageY - 5;

            v_div.style.display = 'block';
            v_div.style.position = 'absolute';
            v_div.style.left = v_left + 'px';
            v_div.style.top = v_right + 'px';

            for (var i = 0; i < v_menu.elements.length; i++) (function (i) {

              var v_li = createSimpleElement('li', null, null);

              var v_span = createSimpleElement('span', null, null);
              v_span.onclick = function () { v_menu.elements[i].action(p_node) };

              var v_a = createSimpleElement('a', null, null);
              var v_ul = createSimpleElement('ul', null, 'sub-menu');

              v_a.appendChild(document.createTextNode(v_menu.elements[i].text));

              v_li.appendChild(v_span);

              if (v_menu.elements[i].icon != undefined) {
                var v_img = createImgElement('null', 'null', v_menu.elements[i].icon);
                v_li.appendChild(v_img);
              }

              v_li.appendChild(v_a);
              v_li.appendChild(v_ul);
              v_div.appendChild(v_li);

              if (v_menu.elements[i].submenu != undefined) {
                var v_span_more = createSimpleElement('div', null, null);
                v_span_more.appendChild(createImgElement(null, 'menu_img', 'images/right.png'));
                v_li.appendChild(v_span_more);
                v_tree.contextMenuLi(v_menu.elements[i].submenu, v_ul, p_node);
              }

            })(i);

            this.contextMenuDiv = v_div;

          }
        }
      },
      ///// Recursive function called when rendering context menu submenus. This function should no be called directly
      // p_submenu: Reference to the submenu object;
      // p_ul: Reference to the UL tag;
      // p_node: Reference to the node;
      contextMenuLi: function (p_submenu, p_ul, p_node) {

        let v_tree = this;

        for (var i = 0; i < p_submenu.elements.length; i++) (function (i) {

          var v_li = createSimpleElement('li', null, null);

          var v_span = createSimpleElement('span', null, null);
          v_span.onclick = function () { p_submenu.elements[i].action(p_node) };

          var v_a = createSimpleElement('a', null, null);
          var v_ul = createSimpleElement('ul', null, 'sub-menu');

          v_a.appendChild(document.createTextNode(p_submenu.elements[i].text));

          v_li.appendChild(v_span);

          if (p_submenu.elements[i].icon != undefined) {
            var v_img = createImgElement('null', 'null', p_submenu.elements[i].icon);
            v_li.appendChild(v_img);
          }

          v_li.appendChild(v_a);
          v_li.appendChild(v_ul);
          p_ul.appendChild(v_li);

          if (p_submenu.elements[i].p_submenu != undefined) {
            var v_span_more = createSimpleElement('div', null, null);
            v_span_more.appendChild(createImgElement(null, 'menu_img', 'images/right.png'));
            v_li.appendChild(v_span_more);
            v_tree.contextMenuLi(p_submenu.elements[i].p_submenu, v_ul, p_node);
          }

        })(i);
      },
      ///// Adjusting tree dotted lines. This function should not be called directly
      // p_node: Reference to the node;
      adjustLines: function (p_ul, p_recursive) {
        var tree = p_ul;

        var lists = [];

        if (tree.childNodes.length > 0) {
          lists = [tree];

          if (p_recursive) {
            for (var i = 0; i < tree.getElementsByTagName("ul").length; i++) {
              var check_ul = tree.getElementsByTagName("ul")[i];
              if (check_ul.childNodes.length != 0)
                lists[lists.length] = check_ul;
            }
          }

        }

        for (var i = 0; i < lists.length; i++) {
          var item = lists[i].lastChild;

          while (!item.tagName || item.tagName.toLowerCase() != "li") {
            item = item.previousSibling;
          }

          item.className += "last";
          item.style.backgroundColor = this.backcolor;

          item = item.previousSibling;

          if (item != null)
            if (item.tagName.toLowerCase() == "li") {
              item.className = "";
              item.style.backgroundColor = 'transparent';
            }
        }
      }
    }

    window.onclick = function () {
      if (tree.contextMenuDiv != null)
        tree.contextMenuDiv.style.display = 'none';
    }

    return tree;
  }

  function readyTreeView(){
    //Tree Context Menu Structure
    var contex_menu = {
      'context1' : {
        elements : [
          {
            text : 'Node Actions',
            icon: 'images/blue_key.png',
            action : function(node) {

            },
            submenu: {
              elements : [
                {
                  text : 'Toggle Node',
                  icon: 'images/leaf.png',
                  action : function(node) {
                    node.toggleNode();
                  }
                },
                {
                  text : 'Expand Node',
                  icon: 'images/leaf.png',
                  action : function(node) {
                    node.expandNode();
                  }
                },
                {
                  text : 'Collapse Node',
                  icon: 'images/leaf.png',
                  action : function(node) {
                    node.collapseNode();
                  }
                },
                {
                  text : 'Expand Subtree',
                  icon: 'images/tree.png',
                  action : function(node) {
                    node.expandSubtree();
                  }
                },
                {
                  text : 'Collapse Subtree',
                  icon: 'images/tree.png',
                  action : function(node) {
                    node.collapseSubtree();
                  }
                },
                {
                  text : 'Delete Node',
                  icon: 'images/delete.png',
                  action : function(node) {
                    node.removeNode();
                  }
                },
              ]
            }
          },
          {
            text : 'Child Actions',
            icon: 'images/blue_key.png',
            action : function(node) {

            },
            submenu: {
              elements : [
                {
                  text : 'Create Child Node',
                  icon: 'images/add1.png',
                  action : function(node) {
                    node.createChildNode('Created',false,'images/folder.png',null,'context1');
                  }
                },
                {
                  text : 'Create 1000 Child Nodes',
                  icon: 'images/add1.png',
                  action : function(node) {
                    for (var i=0; i<1000; i++)
                      node.createChildNode('Created -' + i,false,'images/folder.png',null,'context1');
                  }
                },
                {
                  text : 'Delete Child Nodes',
                  icon: 'images/delete.png',
                  action : function(node) {
                    node.removeChildNodes();
                  }
                }
              ]
            }
          }
        ]
      }
    };
    let tree = createTree('div_tree','white',contex_menu);
    for (var i=1; i<10; i++) {
      let node1 = tree.createNode('Level 0 - Node ' + i,false,'images/star.png',null,null,'context1');
      for (var j=1; j<5; j++) {
        let node2 = node1.createChildNode('Level 1 - Node ' + j, false, 'images/blue_key.png',null,'context1');
        for (var k=1; k<5; k++) {
          let node3 = node2.createChildNode('Level 2 - Node ' + k, false, 'images/monitor.png',null,'context1');
          /*for (var l=1; l<5; l++) {
            node4 = node3.createChildNode('Level 3 - Node ' + l, false, 'images/key_green.png',null,'context1');
            for (var m=1; m<5; m++) {
              node4.createChildNode('Level 4 - Node ' + m, false, 'images/file.png',null,'context1');
            }
          }*/
        }
      }
    }
    tree.drawTree();
  }

  return (
    <div>

      {/* <AppContext.Provider value={{ createTree:createTree() }}>
          <div id="div_tree"></div>
          <Tree tree={data} />
      </AppContext.Provider> */}
      <div id="div_tree"></div>
    </div>
  );
}

export default App;
