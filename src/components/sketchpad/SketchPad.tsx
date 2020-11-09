import React, {Component, useContext, useEffect, useState} from 'react';
import {
  EuiPage,
  EuiPageBody,
  EuiHeader,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiFlexItem,
  EuiFlexGroup,
  EuiPageContent,
  EuiHeaderBreadcrumbs,
  EuiButtonEmpty,
  EuiButtonToggle,
  EuiButton
} from '@elastic/eui';
import '../../assets/css/sketchpad.css';
import Flyout from './flyout/Flyout';
import { BlockMenu, DraggedBlock, FlowBlock, Arrow, TempBlock } from './blocks';
import { BlockInstance, ArrowInstance } from "../../store/BlocksStore";
import { Observer } from 'mobx-react-lite';
import { useJourneyStore } from "../../store/JourneyStore";
import {IDraggedBlock} from "./blocks/DraggedBlock";

function SketchPad() {
  const journeyStore = useJourneyStore();

  const [stateShowSettings, setStateShowSettings] = useState(false);
  const [stateDraggedBlock, setStateDraggedBlock] = useState<any>();
  const [stateBlocks, setStateBlocks] = useState<BlockInstance[]>([]);
  const [stateArrows, setStateArrows] = useState<ArrowInstance[]>([]);
  const [stateBlocksTemp, setStateBlocksTemp] = useState<any>([]);
  const [stateArrowsTemp, setStateArrowsTemp] = useState<any>([]);

  let breadcrumbs: any = [];
  let tempblock2: any = undefined;
  let loaded: boolean = false;
  let blocks: Array<any> = [];
  let blocksTemp: Array<any> = [];
  let arrows: Array<any> = [];
  let arrowsTemp: Array<any> = [];
  let canvas_div: any = undefined;
  let active: boolean = false;
  let paddingx: number = 0;
  let paddingy: number = 0 ;
  let offsetleft: any = 0;
  let offsetleftold: number = 0;
  let rearrange: boolean = false;
  let lastevent: boolean = false;
  let dragx: number = 0;
  let dragy: number = 0;
  let original: any = null;
  let drag: any = undefined;
  let dragId: number = -1;
  let mouse_x: number = 0;
  let mouse_y: number = 0;
  let dragblock: boolean = false;
  let link: boolean = false;
  let canvasRef: any = React.createRef<HTMLDivElement>();
  let flowRef: any = {};
  let chartData: any = '';

  useEffect(() => {
    flowy(canvasRef.current);
  }, []);

  const openConfigurator = () => {
    setStateShowSettings(true);
  }

  const closeSettings = () => {
    setStateShowSettings(false);
  }

  const flowy = (canvas:HTMLDivElement) => {
    let spacing_x: number = 20;
    let spacing_y: number = 60;

    load(canvas, spacing_x, spacing_y);
  }
  
  const blockGrabbed = (block:HTMLDivElement) => {
    block.classList.add("blockdisabled");
    tempblock2 = block;
  }

  const blockReleased = () => {
    if (tempblock2) {
      tempblock2.classList.remove("blockdisabled");
    }
  }

  const blockSnap = (det: any) => {
    let blocksSlice: any = blocks.slice();

    blocksSlice.push({
      left: det.left,
      top: det.top,
      type: det.type,
      id: det.id,
      link: {
        show: false,
        position: 'bottom'
      }
    });

    blocksSlice.forEach((block: { link: { show: boolean; position: string; }; }) => {
      block.link = {
        show: false,
        position: 'bottom'
      }
    });

    setStateBlocks(blocksSlice);
    return true;
  }

  const hideConnector = () => {
    let blocksSlice = blocks.slice();

    blocksSlice.forEach(block => {
      block.link = {
        link: false,
        position: 'bottom'
      }
    });

    setStateBlocks(blocksSlice);
  }

  const output = () => {
    return {
      blocks: blocks.slice(),
      arrows: arrows.slice()
    }
  }

  const clearSketch = () => {
    flowRef = {};
    blocks = [];
    arrows = [];
    
    setStateBlocks(blocks.slice());
    setStateArrows(arrows.slice());
  }

  const deleteBlock = (id: number)=> {
    blocks = blocks.filter((e) => {
      return e.id !== id
    });

    if (id !== 0) {
      let arrowIndex = arrows.findIndex(a => a.id === id);
      if (arrowIndex > -1) {
        arrows.splice(arrowIndex, 1);
      }
    }

    let layer = blocks.slice().filter(a => a.parent === id);
    let flag = false;
    let foundids: any = [];

    while (!flag) {
      for (let i = 0; i < layer.length; i++) {
        if (layer[i] !== id) {
          let blockIndex = blocks.findIndex(b => b.id === layer[i].id);
          let arrIndex = arrows.findIndex(a => a.id === layer[i].id);

          blocks.splice(blockIndex, 1);
          arrows.splice(arrIndex, 1);

          foundids.push(layer[i].id);
        }
      }

      if (foundids.length === 0) {
        flag = true;
      } else {
        layer = blocks.filter(a => foundids.includes(a.parent));
        foundids = [];
      }
    }

    if (blocks.length > 1) {
      rearrangeMe();
    }
    if (lastevent) {
      fixOffset();
    }
    
    draw();
  }

  const beginDrag = (event: any) => {
    if (event.targetTouches) {
      mouse_x = event.changedTouches[0].clientX;
      mouse_y = event.changedTouches[0].clientY;
    } else {
      mouse_x = event.clientX;
      mouse_y = event.clientY;
    }

    if (event.which !== 3 && event.target.closest(".create-flowy")) {
      original = event.target.closest(".create-flowy");
      let blockType = Number(original.querySelector(".blockelemtype").value);
      let blockId = 0;

      if (blocks.length === 0) {
        blockId=0;
      } else {
        blockId = (Math.max.apply(Math, blocks.map(a => a.id)) + 1);
      }

      dragId = blockId;
      blockGrabbed(event.target.closest(".create-flowy"));

      active = true;
      dragx = mouse_x - (event.target.closest(".create-flowy").offsetLeft);
      dragy = mouse_y - (event.target.closest(".create-flowy").offsetTop);

      let left = (mouse_x - dragx);
      let top = (mouse_y - dragy);

      setStateDraggedBlock({
        type: blockType,
        id: blockId,
        left,
        top
      });
      console.log(stateDraggedBlock);
    }
  }

  const touchDone = () => {
    dragblock = false;
  }

  const endDrag = (event: any) => {
    if (event.which !== 3 && (active || rearrange)) {
      dragblock = false;
      blockReleased();

      let dBlockId = dragId;
      let dBlock = blocksTemp.filter(d => d.id === dBlockId)[0];
      let blockType = Number(drag.querySelector(".blockelemtype").value);
      let isParent = dBlock ? (dBlock.parent === -1) : false;

      if (active) {
        original.classList.remove("dragnow");
      }

      if (isParent && rearrange) {
        if (link){
          let xpos = (drag.getBoundingClientRect().left) + (parseInt(window.getComputedStyle(drag).width) / 2) + canvas_div.scrollLeft;
          let ypos = (drag.getBoundingClientRect().top) + canvas_div.scrollTop;
          let blocko = blocks.map(a => a.id);

          for (let i = 0; i < blocks.length; i++) {
            let curBlock:any = blocks.filter(a => a.id === blocko[i])[0];

            if (
              xpos >= (curBlock.x - (curBlock.width / 2) - paddingx) &&
              xpos <= (curBlock.x + (curBlock.width / 2) + paddingx) &&
              ypos >= (curBlock.y - (curBlock.height / 2)) &&
              ypos <= (curBlock.y + curBlock.height)
            ) {
              active = false;
              snap(blocko[i]);
              break;
            }
          }
          
          link = false;
        } else {
          rearrange = false;
          let dragBlock = blocksTemp.slice()[0];
          let dragLeft = ((dragBlock.left + canvas_div.getBoundingClientRect().left) - canvas_div.scrollLeft);
          let dragTop = ((dragBlock.top + canvas_div.getBoundingClientRect().top) - canvas_div.scrollTop);
          dragBlock.x = (dragLeft) + (dragBlock.width / 2);
          dragBlock.y = (dragTop) + (dragBlock.height / 2);
          blocksTemp[0] = dragBlock;

          for (let w = 0; w < blocksTemp.length; w++) {
            if (blocksTemp[w].id !== dragId) {
              let blockInd = blocksTemp.findIndex(b=>b.id === blocksTemp[w].id);
              let arrInd = arrowsTemp.findIndex(a=>a.id === blocksTemp[w].id);
              let tempBlock = blocksTemp.slice()[blockInd];
              let arrBlock = arrowsTemp.slice()[arrInd];
              let bloLeft = ((tempBlock.left + dragBlock.left + canvas_div.getBoundingClientRect().left) - canvas_div.scrollLeft);
              let bloTop = ((tempBlock.top + dragBlock.top + canvas_div.getBoundingClientRect().top) - canvas_div.scrollTop);
              let arrLeft = ((arrBlock.left + dragBlock.left + canvas_div.getBoundingClientRect().left) - canvas_div.scrollLeft);
              let arrTop = ((arrBlock.top + dragBlock.top + canvas_div.getBoundingClientRect().top) - canvas_div.scrollTop);
              let left = ((bloLeft) - (canvas_div.getBoundingClientRect().left) + canvas_div.scrollLeft);
              let top = ((bloTop) - (canvas_div.getBoundingClientRect().top) + canvas_div.scrollTop);
              tempBlock.left = left;
              tempBlock.top = top;

              let aLeft = ((arrLeft) - (canvas_div.getBoundingClientRect().left) + canvas_div.scrollLeft);
              let aTop = ((arrTop) - (canvas_div.getBoundingClientRect().top) + canvas_div.scrollTop);
              arrBlock.left = aLeft;
              arrBlock.top = aTop;

              tempBlock.x = ((left + canvas_div.getBoundingClientRect().left) - canvas_div.scrollLeft) + (tempBlock.width / 2) + canvas_div.scrollLeft;
              tempBlock.y = ((top + canvas_div.getBoundingClientRect().top) - canvas_div.scrollTop) + (tempBlock.height / 2) + canvas_div.scrollTop;

              blocksTemp[blockInd] = tempBlock;
              arrowsTemp[arrInd] = arrBlock;
            }
          }

          blocks = blocks.concat(blocksTemp);
          blocksTemp = [];
          arrows = arrows.concat(arrowsTemp);
          arrowsTemp = [];
        }
      } else if (active && !link && (drag.getBoundingClientRect().top) > (canvas_div.getBoundingClientRect().top) && (drag.getBoundingClientRect().left) > (canvas_div.getBoundingClientRect().left)) {
        active = false;

        let top = ((drag.getBoundingClientRect().top) - (canvas_div.getBoundingClientRect().top) + canvas_div.scrollTop);
        let left = ((drag.getBoundingClientRect().left) - (canvas_div.getBoundingClientRect().left) + canvas_div.scrollLeft);

        setStateDraggedBlock({});
        blockSnap({left, top, type: blockType, id: dBlockId});

        blocks.push({
          parent: -1,
          childwidth: 0,
          id: dBlockId,
          x: (flowRef[dBlockId].getBoundingClientRect().left) + (parseInt(window.getComputedStyle(flowRef[dBlockId]).width) / 2) + canvas_div.scrollLeft,
          y: (flowRef[dBlockId].getBoundingClientRect().top) + (parseInt(window.getComputedStyle(flowRef[dBlockId]).height) / 2) + canvas_div.scrollTop,
          width: parseInt(window.getComputedStyle(flowRef[dBlockId]).width),
          height: parseInt(window.getComputedStyle(flowRef[dBlockId]).height),
          left,
          top,
          type: blockType,
          link:{
            show: false,
            position: 'bottom'
          }
        });
      } else if (active || rearrange) {
        link = false;
        let xpos = (drag.getBoundingClientRect().left) + (parseInt(window.getComputedStyle(drag).width) / 2) + canvas_div.scrollLeft;
        let ypos = (drag.getBoundingClientRect().top) + canvas_div.scrollTop;
        let blocko = blocks.map((a:any) => a.id);


        for (let i = 0; i < blocks.length; i++) {
          let curBlock:any = blocks.filter((a:any) => a.id === blocko[i])[0];

          if (
            xpos >= (curBlock.x - (curBlock.width / 2) - paddingx) &&
            xpos <= (curBlock.x + (curBlock.width / 2) + paddingx) &&
            ypos >= (curBlock.y - (curBlock.height / 2)) &&
            ypos <= (curBlock.y + curBlock.height)
          ) {
            active = false;

            if (!rearrange) {
              snap(blocko[i]);
            } else if (rearrange) {
              snap(blocko[i]);
            }

            break;
          } else if (i === blocks.length - 1) {
            console.log("DRAG-END_END");
            if ((drag.getBoundingClientRect().top) > (canvas_div.getBoundingClientRect().top) && (drag.getBoundingClientRect().left) > (canvas_div.getBoundingClientRect().left)){
              // todo:check for removal
            } else {
              setStateDraggedBlock({});
            }

            rearrange = false;
            active = false;
            break;
          }
        }
      }
      
      hideConnector();
      draw();
    }
  }

  const snap = (snap_id: number) => {
    let blockId = dragId;
    let blockType = Number(drag.querySelector(".blockelemtype").value);
    let totalwidth = 0;
    let totalremove = 0;

    for (let w = 0; w < blocks.filter(id => id.parent === snap_id).length; w++) {
      let children = blocks.filter(id => id.parent === snap_id)[w];

      if (children.childwidth > children.width) {
        totalwidth += children.childwidth + paddingx;
      } else {
        totalwidth += children.width + paddingx;
      }
    }

    totalwidth += parseInt(window.getComputedStyle(drag).width);

    for (let w = 0; w < blocks.filter(id => id.parent === snap_id).length; w++) {
      let children = blocks.filter(id => id.parent === snap_id)[w];

      if (children.childwidth > children.width) {
        let tInd = blocks.findIndex(a=>a.id === children.id);
        let tblock: any = blocks.slice()[tInd];
        let left = (blocks.filter(a => a.id === snap_id)[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2) - (children.width / 2));
        tblock.left = left;

        blocks[tInd] = tblock;
        children.x = blocks.filter(id => id.parent === snap_id)[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2);
        totalremove += children.childwidth + paddingx;
      } else {
        let tInd = blocks.findIndex(a => a.id === children.id);
        let tblock: any = blocks.slice()[tInd];
        let left = (blocks.filter(a => a.id === snap_id)[0].x - (totalwidth / 2) + totalremove);

        tblock.left = left;
        blocks[tInd] = tblock;

        children.x = blocks.filter(id => id.parent === snap_id)[0].x - (totalwidth / 2) + totalremove + (children.width / 2);
        totalremove += children.width + paddingx;
      }
    }

    let left = (blocks.filter(id => id.id === snap_id)[0].x - (totalwidth / 2) + totalremove - (canvas_div.getBoundingClientRect().left) + canvas_div.scrollLeft);
    let top = (blocks.filter(id => id.id === snap_id)[0].y + (blocks.filter(id => id.id === snap_id)[0].height / 2) + paddingy - (canvas_div.getBoundingClientRect().top));

    if (rearrange) {
      let dragBlock = blocksTemp.slice()[0];
      dragBlock.left = left;
      dragBlock.top = top;

      let dragLeft = ((left + canvas_div.getBoundingClientRect().left) - canvas_div.scrollLeft);
      let dragTop = ((top + canvas_div.getBoundingClientRect().top) - canvas_div.scrollTop);

      dragBlock.x = (dragLeft) + (dragBlock.width / 2) + canvas_div.scrollLeft;
      dragBlock.y = (dragTop) + (dragBlock.height / 2) + canvas_div.scrollTop;
      dragBlock.parent = snap_id;
      blocksTemp[0] = dragBlock;

      for (let w = 0; w < blocksTemp.length; w++) {
        if (blocksTemp[w].id !== blockId) {
          let blockInd = blocksTemp.findIndex(b => b.id === blocksTemp[w].id);
          let arrInd = arrowsTemp.findIndex(a => a.id === blocksTemp[w].id);
          let tempBlock = blocksTemp.slice()[blockInd];
          let arrBlock = arrowsTemp.slice()[arrInd];

          let blockLeft = ((tempBlock.left + dragBlock.left + canvas_div.getBoundingClientRect().left) - canvas_div.scrollLeft);
          let blockTop = ((tempBlock.top + dragBlock.top + canvas_div.getBoundingClientRect().top) - canvas_div.scrollTop);
          let arrowLeft = ((arrBlock.left + dragBlock.left + canvas_div.getBoundingClientRect().left) - canvas_div.scrollLeft);
          let arrowTop = ((arrBlock.top + dragBlock.top + canvas_div.getBoundingClientRect().top) - canvas_div.scrollTop);
          let bleft = ((blockLeft) - (canvas_div.getBoundingClientRect().left) + canvas_div.scrollLeft);
          let btop = ((blockTop) - (canvas_div.getBoundingClientRect().top) + canvas_div.scrollTop);

          tempBlock.left = bleft;
          tempBlock.top = btop;

          let aLeft = ((arrowLeft) - (canvas_div.getBoundingClientRect().left) + canvas_div.scrollLeft + 20);
          let aTop = ((arrowTop) - (canvas_div.getBoundingClientRect().top) + canvas_div.scrollTop);
          arrBlock.left = aLeft;
          arrBlock.top = aTop;
          tempBlock.x = ((bleft + canvas_div.getBoundingClientRect().left) - canvas_div.scrollLeft) + (tempBlock.width / 2) + canvas_div.scrollLeft;
          tempBlock.y = ((btop + canvas_div.getBoundingClientRect().top) - canvas_div.scrollTop) + (tempBlock.height / 2) + canvas_div.scrollTop;

          blocksTemp[blockInd] = tempBlock;
          arrowsTemp[arrInd] = arrBlock;
        }
      }
      
      blocks = blocks.concat(blocksTemp);
      blocksTemp = [];
      arrows = arrows.concat(arrowsTemp);
      arrowsTemp = [];
    } else {
      setStateDraggedBlock({});

      blockSnap({left,top,type:blockType,id:blockId});
      blocks.push({
        childwidth: 0,
        parent: snap_id,
        id: blockId,
        x: (flowRef[blockId].getBoundingClientRect().left) + (parseInt(window.getComputedStyle(flowRef[blockId]).width) / 2) + canvas_div.scrollLeft,
        y: (flowRef[blockId].getBoundingClientRect().top) + (parseInt(window.getComputedStyle(flowRef[blockId]).height) / 2) + canvas_div.scrollTop,
        width: parseInt(window.getComputedStyle(flowRef[blockId]).width),
        height: parseInt(window.getComputedStyle(flowRef[blockId]).height),
        left,
        top,
        type: blockType,
        link: {
          show: false,
          position: 'bottom'
        }
      });
    }

    let arrowhelp = blocks.filter(a => a.id === blockId)[0];
    let arrowx = arrowhelp.x - blocks.filter(a => a.id === snap_id)[0].x + 20;
    let arrowy = parseFloat(arrowhelp.y - (arrowhelp.height / 2) - (blocks.filter(id => id.parent === snap_id)[0].y + (blocks.filter(id => id.parent === snap_id)[0].height / 2)) + canvas_div.scrollTop);

    let path1 = "";
    let path2 = "";
    let aLeft = 0;
    let aTop = 0;

    if (arrowx < 0) {
      path1 = `M ${(blocks.filter(a => a.id === snap_id)[0].x - arrowhelp.x + 5)} 0L${(blocks.filter(a => a.id === snap_id)[0].x - arrowhelp.x + 5)} ${(paddingy / 2)}L5 ${(paddingy / 2)}  L5 ${arrowy}`;
      path2 = `M0 ${(arrowy - 5)} H10L5 ${arrowy}L0 ${(arrowy - 5)} Z`;
      aLeft = ((arrowhelp.x - 5) - (canvas_div.getBoundingClientRect().left) + canvas_div.scrollLeft);
    } else {
      path1 = `M20 0L20 ${(paddingy / 2)}L${(arrowx)} ${(paddingy / 2)}L${arrowx} ${arrowy}`;
      path2 = `M${(arrowx - 5)} ${(arrowy - 5)}H${(arrowx + 5)}L${arrowx} ${arrowy}L${(arrowx - 5)} ${(arrowy - 5)} Z`;
      aLeft = (blocks.filter(a => a.id === snap_id)[0].x - 20 - (canvas_div.getBoundingClientRect().left) + canvas_div.scrollLeft);
    }

    aTop = (blocks.filter(a => a.id === snap_id)[0].y + (blocks.filter(a => a.id === snap_id)[0].height / 2));

    arrows.push({
      id:blockId,
      path1,
      path2,
      left: aLeft,
      top: aTop
    });

    if (blocks.filter(a => a.id === snap_id)[0].parent !== -1) {
      let flag = false;
      let idval = snap_id;

      while (!flag) {
        if (blocks.filter(a => a.id === idval)[0].parent === -1) {
          flag = true;
        } else {
          let zwidth = 0;

          for (let w = 0; w < blocks.filter(id => id.parent === idval).length; w++) {
            let children = blocks.filter(id => id.parent === idval)[w];
            if (children.childwidth > children.width) {
              if (w === blocks.filter(id => id.parent === idval).length - 1) {
                zwidth += children.childwidth;
              } else {
                zwidth += children.childwidth + paddingx;
              }
            } else {
              if (w === blocks.filter(id => id.parent === idval).length - 1) {
                zwidth += children.width;
              } else {
                zwidth += children.width + paddingx;
              }
            }
          }

          blocks.filter(a => a.id === idval)[0].childwidth = zwidth;
          idval = blocks.filter(a => a.id === idval)[0].parent;
        }
      }

      blocks.filter(id => id.id === idval)[0].childwidth = totalwidth;
    }

    if (rearrange) {
      rearrange = false;
    }

    rearrangeMe();
    checkOffset();
  }

  const rearrangeMe = () => {
    let result = blocks.map(a => a.parent);

    for (let z = 0; z < result.length; z++) {
      if (result[z] === -1) {
        if(z+1 < result.length){
          z++;
        } else {
          break;
        }
      }

      let totalwidth = 0;
      let totalremove = 0;

      for (let w = 0; w < blocks.filter(id => id.parent === result[z]).length; w++) {
        let children = blocks.filter(id => id.parent === result[z])[w];

        if (blocks.filter(id => id.parent === children.id).length === 0) {
          children.childwidth = 0;
        }

        if (children.childwidth > children.width) {
          if (w === blocks.filter(id => id.parent === result[z]).length - 1) {
            totalwidth += children.childwidth;
          } else {
            totalwidth += children.childwidth + paddingx;
          }
        } else {
          if (w === blocks.filter(id => id.parent === result[z]).length - 1) {
            totalwidth += children.width;
          } else {
            totalwidth += children.width + paddingx;
          }
        }
      }

      if (result[z] !== -1) {
        blocks.filter(a => a.id === result[z])[0].childwidth = totalwidth;
      }

      for (let w = 0; w < blocks.filter(id => id.parent === result[z]).length; w++) {
        let children = blocks.filter(id => id.parent === result[z])[w];
        let r_index = blocks.findIndex(a => a.id === children.id);
        const r_block:any = blocks.slice()[r_index];

        const r_array:any = blocks.slice().filter(id => id.id === result[z]);

        if (!r_array.length) {
          break;
        }

        let r_left = 0;

        if (children.childwidth > children.width) {
          r_left = (r_array[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2) - (children.width / 2) - (canvas_div.getBoundingClientRect().left));
          children.x = r_array[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2);
          totalremove += children.childwidth + paddingx;
        } else {
          r_left = (r_array[0].x - (totalwidth / 2) + totalremove - (canvas_div.getBoundingClientRect().left));
          children.x = r_array[0].x - (totalwidth / 2) + totalremove + (children.width / 2);
          totalremove += children.width + paddingx;
        }

        r_block.left = r_left;
        blocks[r_index]= r_block;

        let arrowhelp = blocks.filter(a => a.id === children.id)[0];
        let arrowx = arrowhelp.x - blocks.filter(a => a.id === children.parent)[0].x + 20;
        let arrowy = arrowhelp.y - (arrowhelp.height / 2) - (blocks.filter(a => a.id === children.parent)[0].y + (blocks.filter(a => a.id === children.parent)[0].height / 2));
        let aIndex = arrows.findIndex(a => a.id === children.id);
        let top = (blocks.filter(id => id.id === children.parent)[0].y + (blocks.filter(id => id.id === children.parent)[0].height / 2) - (canvas_div.getBoundingClientRect().top));
        let left=0;
        let path1="";
        let path2="";

        if (arrowx < 0) {
          left = ((arrowhelp.x - 5) - (canvas_div.getBoundingClientRect().left));
          path1 = `M${(blocks.filter(id => id.id === children.parent)[0].x - arrowhelp.x + 5)}  0L${(blocks.filter(id => id.id === children.parent)[0].x - arrowhelp.x + 5)} ${(paddingy / 2)}L5 ${(paddingy / 2)}L5 ${arrowy}`;
          path2 = `M0 ${(arrowy - 5)}H10L5 ${arrowy}L0 ${(arrowy - 5)}Z`;
        } else {
          left = (blocks.filter(id => id.id === children.parent)[0].x - 20 - (canvas_div.getBoundingClientRect().left));
          path1 = `M20 0L20 ${(paddingy / 2)}L${(arrowx)} ${(paddingy / 2)}L${arrowx} ${arrowy}`;
          path2 = `M${(arrowx - 5)} ${(arrowy - 5)}H${(arrowx + 5)}L${arrowx} ${arrowy}L${(arrowx - 5)} ${(arrowy - 5)}Z`;
        }

        arrows[aIndex] = {
          id:children.id,
          path1,
          path2,
          left,
          top
        };
      }
    }
  }

  const checkOffset = () => {
    offsetleft = blocks.map(a => a.x);
    let widths = blocks.map(a => a.width);
    let mathmin = offsetleft.map((item:any, index:any) => {
      return item - (widths[index] / 2);
    })
    offsetleft = Math.min.apply(Math, mathmin);

    if (offsetleft < (canvas_div.getBoundingClientRect().left)) {
      lastevent = true;
      let blocko = blocks.map(a => a.id);
      for (let w = 0; w < blocks.length; w++) {

        let oInd = blocks.findIndex(a => a.id === blocko[w]);
        let oBlock:any = blocks.slice()[oInd];

        let left = (blocks.filter(a => a.id === blocko[w])[0].x - (blocks.filter(a => a.id === blocko[w])[0].width / 2) - offsetleft + 20);

        oBlock.left = left;

        blocks[oInd] = oBlock;

        if (blocks.filter(a => a.id === blocko[w])[0].parent !== -1) {
          let arrowhelp = blocks.filter(a => a.id === blocko[w])[0];
          let arrowx = arrowhelp.x - blocks.filter(a => a.id === blocks.filter(a => a.id === blocko[w])[0].parent)[0].x;
          let aIndex = arrows.findIndex(a=>a.id===blocko[w]);
          let left = 0;

          if (arrowx < 0) {
            left = (arrowhelp.x - offsetleft + 20 - 5);
          } else {
            left = (blocks.filter(id => id.id === blocks.filter(a => a.id === blocko[w])[0].parent)[0].x - 20 - offsetleft + 20);
          }

          arrows[aIndex] = {
            id:blocko[w],
            path1:arrows[aIndex].path1,
            path2:arrows[aIndex].path2,
            left,
            top:arrows[aIndex].top
          };
        }
      }

      for (let w = 0; w < blocks.length; w++) {
        let tBlock = blocks.slice()[w];
        let tLeft = ((tBlock.left + canvas_div.getBoundingClientRect().left) - canvas_div.scrollLeft);
        tBlock.x = (tLeft) + (canvas_div.getBoundingClientRect().left + canvas_div.scrollLeft) - (tBlock.width / 2) - 40;
      }

      offsetleftold = offsetleft;
    }
  }

  const touchblock = (event: any) => {
    dragblock = false;

    if (hasParentClass(event.target, "block")) {
      let selectedBlock = event.target.closest(".block");
      let blockId = selectedBlock.querySelector(".blockid").value;
      if (event.targetTouches) {
        mouse_x = event.targetTouches[0].clientX;
        mouse_y = event.targetTouches[0].clientY;
      } else {
        mouse_x = event.clientX;
        mouse_y = event.clientY;
      }

      if (event.type !== "mouseup" && hasParentClass(event.target, "block")) {
        if (event.which !== 3) {
          if (!active && !rearrange) {
            dragblock = true;
            dragId = Number(blockId);
            drag = flowRef[blockId];
            dragx = mouse_x - (drag.getBoundingClientRect().left);
            dragy = mouse_y - (drag.getBoundingClientRect().top);
          }
        }
      }
    }
  }

  const hasParentClass: any = (element: any, classname: string) => {
    if (element.className) {
      if (element.className.split && element.className.split(' ').indexOf(classname) >= 0) {
        return true;
      }
    }

    return element.parentNode && hasParentClass(element.parentNode, classname);
  }

  const moveBlock = (event: any) => {
    if (event.targetTouches) {
      mouse_x = event.targetTouches[0].clientX;
      mouse_y = event.targetTouches[0].clientY;
    } else {
      mouse_x = event.clientX;
      mouse_y = event.clientY;
    }

    let left = (mouse_x - dragx);
    let top = (mouse_y - dragy);

    if (dragblock) {
      rearrange = true;
      drag.classList.add("dragging");
      let blockid = dragId;
      blocksTemp.push(blocks.slice().filter(a => a.id === blockid)[0]);
      blocksTemp[0].parent = -1;

      let dragLeft = ((blocksTemp[0].left + canvas_div.getBoundingClientRect().left) - canvas_div.scrollLeft);
      let dragTop = ((blocksTemp[0].top + canvas_div.getBoundingClientRect().top) - canvas_div.scrollTop);

      blocks = blocks.filter((e) => {
        return e.id !== blockid
      });

      if (blockid !== 0) {

        let arrowIndex = arrows.findIndex(a=>a.id === blockid);
        if (arrowIndex > -1) {
          arrows.splice(arrowIndex, 1);
        }
      }

      let layer = blocks.slice().filter(a => a.parent === blockid);
      let flag = false;
      let foundids:any = [];

      while (!flag) {
        for (let i = 0; i < layer.length; i++) {
          if (layer[i] !== blockid) {

            let dragBlock = blocks.slice().filter(a => a.id === layer[i].id)[0];
            let dragArrow = arrows.slice().filter(r => r.id === layer[i].id)[0];

            let blockLeft = ((dragBlock.left + canvas_div.getBoundingClientRect().left) - canvas_div.scrollLeft);
            let blockTop = ((dragBlock.top + canvas_div.getBoundingClientRect().top) - canvas_div.scrollTop);
            let arrowLeft = ((dragArrow.left + canvas_div.getBoundingClientRect().left) - canvas_div.scrollLeft);
            let arrowTop = ((dragArrow.top + canvas_div.getBoundingClientRect().top) - canvas_div.scrollTop);

            let left = (blockLeft - dragLeft);
            let top = (blockTop - dragTop);
            let aLeft = (arrowLeft - dragLeft);
            let aTop = (arrowTop - dragTop);

            dragBlock.left = left;
            dragBlock.top = top;
            dragArrow.left = aLeft;
            dragArrow.top = aTop;

            blocksTemp.push(dragBlock);
            arrowsTemp.push({...dragArrow});

            let blockIndex = blocks.findIndex(b=>b.id===dragBlock.id);
            let arrIndex = arrows.findIndex(a=>a.id===dragArrow.id);

            blocks.splice(blockIndex, 1);
            arrows.splice(arrIndex, 1);

            foundids.push(layer[i].id);

            dragArrow = null;
            dragBlock = null;
          }
        }

        if (foundids.length === 0) {
          flag = true;
        } else {
          layer = blocks.filter(a => foundids.includes(a.parent));
          foundids = [];
        }
      }

      if (blocks.length > 1) {
        rearrangeMe();
      }

      if (lastevent) {
        fixOffset();
      }

      dragblock = false;
    }

    if (active) {
      const drag = stateDraggedBlock;

      drag.left = left;
      drag.top = top;

      setStateDraggedBlock(drag);

    } else if (rearrange) {
      let tBlock = blocksTemp.slice()[0];
      let left = (mouse_x - dragx - (canvas_div.getBoundingClientRect().left) + canvas_div.scrollLeft);
      let top = (mouse_y - dragy - (canvas_div.getBoundingClientRect().top) + canvas_div.scrollTop);

      tBlock.left = left;
      tBlock.top = top;

      let bLeft = ((left + canvas_div.getBoundingClientRect().left) - canvas_div.scrollLeft);
      let bTop = ((top + canvas_div.getBoundingClientRect().top) - canvas_div.scrollTop);
      tBlock.x = (bLeft) + (tBlock.width / 2) + canvas_div.scrollLeft;
      tBlock.y = (bTop) + (tBlock.height / 2) + canvas_div.scrollTop; // reminder:left replaced by top
      blocksTemp[0] = tBlock;
    }

    if (active || rearrange) {
      let xpos = (drag.getBoundingClientRect().left) + (parseInt(window.getComputedStyle(drag).width) / 2) + canvas_div.scrollLeft;
      let ypos = (drag.getBoundingClientRect().top) + canvas_div.scrollTop;
      let blocko = blocks.map(a => a.id);

      for (let i = 0; i < blocks.length; i++) {
        let curBlock:any = blocks.filter((a:any)=> a.id === blocko[i])[0];

        if (
          (xpos >= (curBlock.x - (curBlock.width / 2) - paddingx)) &&
          (xpos <= (curBlock.x + (curBlock.width / 2) + paddingx)) &&
          (ypos >= (curBlock.y - (curBlock.height / 2))) &&
          (ypos <= (curBlock.y + curBlock.height))
        ) {

          link = true;
          let blockIndex = blocks.findIndex(a=>a.id===blocko[i]);
          let glowBlock = blocks.slice()[blockIndex];

          glowBlock.link = {
            show: true,
            position: 'bottom'
          };

          blocks[blockIndex] = glowBlock;
          break;

        } else {
          link = false;
          let blockIndex = blocks.findIndex(a=>a.id===blocko[i]);
          let glowBlock = blocks.slice()[blockIndex];

          glowBlock.link = {
            show: false,
            position: 'bottom'
          };

          blocks[blockIndex] = glowBlock;
        }
      }
    }

    draw();
  }

  const fixOffset = () => {
    if (offsetleftold < (canvas_div.getBoundingClientRect().left)) {
      lastevent = false;
      let blocko = blocks.map(a => a.id);

      for (let w = 0; w < blocks.length; w++) {
        let offInd = blocks.findIndex(a => a.id === blocko[w]);
        let offBlock:any = blocks.slice()[offInd];
        let left = (offBlock.x - (offBlock.width / 2) - offsetleftold - 20);
        offBlock.left = left;
        let blockLeft = ((left + canvas_div.getBoundingClientRect().left) - canvas_div.scrollLeft);
        offBlock.x = (blockLeft) + (offBlock.width / 2);

        if (offBlock.parent !== -1) {
          let arrowhelp = offBlock;
          let arrowx = arrowhelp.x - blocks.filter(a => a.id === offBlock.parent)[0].x;
          let aIndex = arrows.findIndex(a=>a.id===blocko[w]);
          let aleft = 0;

          if (arrowx < 0) {
            aleft = (arrowhelp.x - 5 - (canvas_div.getBoundingClientRect().left));
          } else {
            aleft = (blocks.filter(id => id.id === offBlock.parent)[0].x - 20 - (canvas_div.getBoundingClientRect().left));
          }

          let aArrow = arrows.slice()[aIndex];
          aArrow.left = aleft;
          arrows[aIndex] = aArrow;
        }

        blocks[offInd] = offBlock;
      }

      offsetleftold = 0;
    }
  }

  const load = (canvas: HTMLDivElement, spacing_x:number, spacing_y: number) => {
    if (!loaded) {
      loaded = true;
    } else {
      return;
    }

    canvas_div = canvas;
    paddingx = spacing_x;
    paddingy = spacing_y;

    if (journeyStore.editMode) {
      startEdit();
    } else {
      importData();
    }
  }

  const startEdit = () => {
    if (journeyStore.editMode) {
      document.addEventListener("mousedown",touchblock, false);
      document.addEventListener("touchstart",touchblock, false);
      document.addEventListener("mouseup", touchblock, false);

      document.addEventListener('mousedown',beginDrag);
      document.addEventListener('touchstart',beginDrag);

      document.addEventListener("mouseup", endDrag, false);
      document.addEventListener("touchend", endDrag, false);

      document.addEventListener("mousemove", moveBlock, false);
      document.addEventListener("touchmove", moveBlock, false);
    }
  }

  const editTrigger = () => {
    if (!journeyStore.editMode) {
      journeyStore.setEditMode(true);
      startEdit();
    }
  }

  const exportData = () => {
    chartData = JSON.stringify(output());
    localStorage.setItem("journey_1",chartData);
    clearSketch();
  }

  const importData = () => {
    chartData = localStorage.getItem("journey_1");

    if (chartData) {
      const output = JSON.parse(chartData);
      setStateBlocks(output.blocks.slice());
      setStateArrows(output.arrows.slice())
    }
  }

  const setDragRef = (newDrag: any) => {
    drag = newDrag;
  }

  const setFlowRef = (id: number, flow: any) => {
    flowRef[id] = flow;

  }

  const setTempRef = (temp: any) => {
    drag = temp[dragId];
  }

  const draw = () => {
    setStateBlocks(blocks.slice());
    setStateArrows(arrows.slice());
    setStateBlocksTemp(blocksTemp.slice());
    setStateArrowsTemp(arrowsTemp.slice());
  }

  const showBlock = blocks.length > 0;

  return (
    <Observer>{() => (
      <EuiPage className="full-height">
        <EuiPageBody>
          <EuiHeader>
            <EuiHeaderSection grow={false}>
              <EuiHeaderSectionItem border="none">
                <EuiButtonEmpty
                  iconType="arrowLeft"
                >
                  Back
                </EuiButtonEmpty>
              </EuiHeaderSectionItem>
            </EuiHeaderSection>
            <EuiHeaderBreadcrumbs breadcrumbs={breadcrumbs}/>
            <EuiHeaderSection side="right" className="content-center">
              <EuiButtonToggle
                label="Edit"
                fill={journeyStore.editMode}
                onChange={editTrigger}
                isSelected={journeyStore.editMode}
                size="s"
              />
              <EuiButton
                fill
                onClick={exportData}
                size="s"
                color="secondary"
                style={{marginLeft: 10}}
              >
                Save
              </EuiButton>
              <EuiButton
                fill
                onClick={clearSketch}
                size="s"
                color="danger"
                style={{marginLeft: 10, marginRight: 10}}
              >
                Clear
              </EuiButton>
            </EuiHeaderSection>
          </EuiHeader>
          <EuiFlexGroup gutterSize="none">
            <EuiFlexItem grow={false}>
              {journeyStore.editMode ? <BlockMenu/> : null}
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiPageContent paddingSize="none">
                {stateShowSettings ? <Flyout closeSettings={closeSettings}/> : null}
                <div className={`canvas ${(journeyStore.editMode ? 'edit-bg' : 'view-bg')}`} ref={canvasRef}>
                  {
                    showBlock ? (
                      stateBlocks.map((block: BlockInstance, index: any) => <FlowBlock type={block.type} id={block.id}
                                                                                       left={block.left} top={block.top}
                                                                                       link={block.link}
                                                                                       key={`.${index}`}
                                                                                       setFlowRef={setFlowRef}
                                                                                       openConfigurator={openConfigurator}
                                                                                       deleteBlock={deleteBlock}/>)
                    ) : null
                  }

                  {
                    arrows.length ? (
                      stateArrows.map((arrow: ArrowInstance, index: any) => <Arrow id={arrow.id} path1={arrow.path1}
                                                                                   path2={arrow.path2} left={arrow.left}
                                                                                   top={arrow.top} key={`_${index}`} type={undefined} />)
                    ) : null
                  }
                  {
                    blocksTemp.length ? (
                      <TempBlock left={stateBlocksTemp[0].left} top={stateBlocksTemp[0].top}
                                 type={stateBlocksTemp[0].type} id={stateBlocksTemp[0].id}
                                 blocksTemp={stateBlocksTemp.slice(1)} arrowsTemp={stateArrowsTemp}
                                 setTempRef={setTempRef}/>
                    ) : null
                  }
                </div>
              </EuiPageContent>
            </EuiFlexItem>
            {stateDraggedBlock ?
              <DraggedBlock type={stateDraggedBlock.type} id={stateDraggedBlock.id} left={stateDraggedBlock.left}
                            top={stateDraggedBlock.top} setDragRef={setDragRef}/> : null}
          </EuiFlexGroup>
        </EuiPageBody>
      </EuiPage>
    )}</Observer>
  );
}

export default SketchPad;
