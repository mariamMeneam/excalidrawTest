import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  exportToCanvas,
  exportToSvg,
  exportToBlob,
  exportToClipboard,
  Excalidraw,
  useHandleLibrary,
  MIME_TYPES,
  // sceneCoordsToViewportCoords,
  // viewportCoordsToSceneCoords,
  // restoreElements,
  LiveCollaborationTrigger,
  MainMenu,
  // Footer,
  // Sidebar,
  WelcomeScreen,
} from "@excalidraw/excalidraw";

import {
  // AppState,
  BinaryFileData,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
  // Gesture,
  LibraryItems,
  // PointerDownState as ExcalidrawPointerDownState,
} from "@excalidraw/excalidraw/types/types";

// import ExampleSidebar from "./sidebar/ExampleSidebar";

import "./App.scss";
import initialData from "./initialData";

import { NonDeletedExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
// import { nanoid } from "nanoid";
// import CustomFooter from "./CustomFooter";
import MobileFooter from "./MobileFooter";
import {
  resolvablePromise,
  // withBatchedUpdates,
  // withBatchedUpdatesThrottled,
  // distance2d,
} from "./utils";
import { ResolvablePromise } from "@excalidraw/excalidraw/types/utils";
import { THEME } from "@excalidraw/excalidraw";
declare global {
  interface Window {
    ExcalidrawLib: any;
  }
}

// type Comment = {
//   x: number;
//   y: number;
//   value: string;
//   id?: string;
// };

// type PointerDownState = {
//   x: number;
//   y: number;
//   hitElement: Comment;
//   onMove: any;
//   onUp: any;
//   hitElementOffsets: {
//     x: number;
//     y: number;
//   };
// };
// This is so that we use the bundled excalidraw.development.js file instead
// of the actual source code

// const COMMENT_ICON_DIMENSION = 32;
// const COMMENT_INPUT_HEIGHT = 50;
// const COMMENT_INPUT_WIDTH = 150;

export default function App() {
// const [docked, setDocked] = useState(false);
// const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const appRef = useRef<any>(null);
  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string>("");
  const [canvasUrl, setCanvasUrl] = useState<string>("");
  const [exportWithDarkMode, setExportWithDarkMode] = useState(false);
  const [exportEmbedScene, setExportEmbedScene] = useState(false);
  const [isCollaborating, setIsCollaborating] = useState(false);
  // const [commentIcons, setCommentIcons] = useState<{ [id: string]: Comment }>(
  //   {}
  // );
  // const [comment, setComment] = useState<Comment | null>(null);

  const initialStatePromiseRef = useRef<{
    promise: ResolvablePromise<ExcalidrawInitialDataState | null>;
  }>({ promise: null! });
  if (!initialStatePromiseRef.current.promise) {
    initialStatePromiseRef.current.promise =
      resolvablePromise();
  }

  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  useHandleLibrary({ excalidrawAPI });

  useEffect(() => {
    if (!excalidrawAPI) {
      return;
    }
    // const libraryItems = [
    //   {
    //     status: "published",
    //     id: "1",
    //     created: 1,
    //     elements: initialData.libraryItems[1],
    //   },
    //   {
    //     status: "unpublished",
    //     id: "2",
    //     created: 2,
    //     elements: initialData.libraryItems[1],
    //   },
    // ];
    // excalidrawAPI.updateLibrary({
    //   libraryItems,
    //   openLibraryMenu: true,
    // });
    
    // excalidrawAPI.updateLibrary({ libraryItems: newLibraryItems });
    const fetchData = async () => {
      const res = await fetch("http://localhost:3000/whiteboaredtest.excalidraw");
      // const blob = new Blob([res.url], { type: 'application/json' });
      // const blobURL = URL.createObjectURL(blob);
      console.log("resssssssss" , res );
      // console.log("resssssssss" ,  res.text());
     

      // const reader = new FileReader();
      const content = await res.text();
      console.log(content);
        // Parse the JSON string to an object
        const parsedData = JSON.parse(content);

        // Convert the object back to a JSON string
        const jsonString = JSON.stringify(parsedData);

        // Convert the JSON string to a Blob
        const contentBlob = new Blob([jsonString], { type: 'application/json' });
      
      // const imageData = await res.blob();
      // const contentURL = URL.createObjectURL(imageData);
      // console.log("resssssssss" , reader.readAsDataURL(imageData)
      // );
      // reader.readAsDataURL(imageData);
      // const scene = await loadFromBlob(contentBlob, null, null);
      // excalidrawAPI.updateScene(parsedData);
 //@ts-ignore
 initialStatePromiseRef.current.promise.resolve( JSON.parse(content));
      // reader.onload = function () {
      //   const imagesArray: BinaryFileData[] = [
      //     {
      //       id: "rocket" as BinaryFileData["id"],
      //       dataURL: reader.result as BinaryFileData["dataURL"],
      //       mimeType: MIME_TYPES.jpg,
      //       created: 1644915140367,
      //       lastRetrieved: 1644915140367,
      //     },
      //   ];

       
      //   excalidrawAPI.addFiles(imagesArray);
      // };
    };
    fetchData();
  }, [excalidrawAPI]);

  const renderTopRightUI = (isMobile: boolean) => {
    return (
      <>
        {!isMobile && (
          <LiveCollaborationTrigger
            isCollaborating={isCollaborating}
            onSelect={() => {
              window.alert("Collab dialog clicked");
            }}
          />
        )}
        {/* <button
          onClick={() => alert("This is dummy top right UI")}
          style={{ height: "2.5rem" }}
        >
          {" "}
          Click me{" "}
        </button> */}
      </>
    );
  };

  // const updateScene = () => {
  //   const sceneData = {
  //     elements: 
  //       [
  //         {
  //           id: "6sVDp9mCGQTomD9Cg5w1b",
  //           type: "rectangle",
  //           x: 202.04296875,
  //           y: -672.6953125,
  //           width: 163,
  //           height: 185,
  //           angle: 0,
  //           strokeColor: "#000000",
  //           backgroundColor: "#e64980",
  //           fillStyle: "solid",
  //           strokeWidth: 1,
  //           strokeStyle: "solid",
  //           roughness: 1,
  //           opacity: 100,
  //           groupIds: [],
  //           strokeSharpness: "sharp",
  //           seed: 1640006454,
  //           version: 74,
  //           versionNonce: 1054194038,
  //           isDeleted: false,
  //           boundElements: [
  //             {
  //               type: "text",
  //               id: "MB9CSH621UIKH8MEgOhaM"
  //             }
  //           ],
  //           updated: 1639729535736,
  //           customData: {
  //             id: "rect-1",
  //             version: "1"
  //           }
  //         },
  //       ],
  //     appState: {
  //       viewBackgroundColor: "#edf2ff",
  //     },
  //   };
  //   excalidrawAPI?.updateScene(sceneData);
  // };

  const onLinkOpen = useCallback(
    (
      element: NonDeletedExcalidrawElement,
      event: CustomEvent<{
        nativeEvent: MouseEvent | React.PointerEvent<HTMLCanvasElement>;
      }>
    ) => {
      const link = element.link!;
      const { nativeEvent } = event.detail;
      const isNewTab = nativeEvent.ctrlKey || nativeEvent.metaKey;
      const isNewWindow = nativeEvent.shiftKey;
      const isInternalLink =
        link.startsWith("/") || link.includes(window.location.origin);
      if (isInternalLink && !isNewTab && !isNewWindow) {
        // signal that we're handling the redirect ourselves
        event.preventDefault();
        // do a custom redirect, such as passing to react-router
        // ...
      }
    },
    []
  );

  const onCopy = async (type: "png" | "svg" | "json") => {
    if (!excalidrawAPI) {
      return false;
    }
    await exportToClipboard({
      elements: excalidrawAPI.getSceneElements(),
      appState: excalidrawAPI.getAppState(),
      files: excalidrawAPI.getFiles(),
      type,
    });
    window.alert(`Copied to clipboard as ${type} successfully`);
  };

  // const [pointerData, setPointerData] = useState<{
  //   pointer: { x: number; y: number };
  //   button: "down" | "up";
  //   pointersMap: Gesture["pointers"];
  // } | null>(null);

  // const onPointerDown = (
  //   activeTool: AppState["activeTool"],
  //   pointerDownState: ExcalidrawPointerDownState
  // ) => {
  //   if (activeTool.type === "custom" && activeTool.customType === "comment") {
  //     const { x, y } = pointerDownState.origin;
  //     setComment({ x, y, value: "" });
  //   }
  // };

  // const rerenderCommentIcons = () => {
  //   if (!excalidrawAPI) {
  //     return false;
  //   }
  //   const commentIconsElements = appRef.current.querySelectorAll(
  //     ".comment-icon"
  //   ) as HTMLElement[];
  //   commentIconsElements.forEach((ele) => {
  //     const id = ele.id;
  //     const appstate = excalidrawAPI.getAppState();
  //     const { x, y } = sceneCoordsToViewportCoords(
  //       { sceneX: commentIcons[id].x, sceneY: commentIcons[id].y },
  //       appstate
  //     );
  //     ele.style.left = `${
  //       x - COMMENT_ICON_DIMENSION / 2 - appstate!.offsetLeft
  //     }px`;
  //     ele.style.top = `${
  //       y - COMMENT_ICON_DIMENSION / 2 - appstate!.offsetTop
  //     }px`;
  //   });
  // };

  // const onPointerMoveFromPointerDownHandler = (
  //   pointerDownState: PointerDownState
  // ) => {
  //   return withBatchedUpdatesThrottled((event) => {
  //     if (!excalidrawAPI) {
  //       return false;
  //     }
  //     const { x, y } = viewportCoordsToSceneCoords(
  //       {
  //         clientX: event.clientX - pointerDownState.hitElementOffsets.x,
  //         clientY: event.clientY - pointerDownState.hitElementOffsets.y,
  //       },
  //       excalidrawAPI.getAppState()
  //     );
  //     setCommentIcons({
  //       ...commentIcons,
  //       [pointerDownState.hitElement.id!]: {
  //         ...commentIcons[pointerDownState.hitElement.id!],
  //         x,
  //         y,
  //       },
  //     });
  //   });
  // };
  // const onPointerUpFromPointerDownHandler = (
  //   pointerDownState: PointerDownState
  // ) => {
  //   return withBatchedUpdates((event) => {
  //     window.removeEventListener("pointermove", pointerDownState.onMove);
  //     window.removeEventListener("pointerup", pointerDownState.onUp);
  //     excalidrawAPI?.setActiveTool({ type: "selection" });
  //     const distance = distance2d(
  //       pointerDownState.x,
  //       pointerDownState.y,
  //       event.clientX,
  //       event.clientY
  //     );
  //     if (distance === 0) {
  //       if (!comment) {
  //         setComment({
  //           x: pointerDownState.hitElement.x + 60,
  //           y: pointerDownState.hitElement.y,
  //           value: pointerDownState.hitElement.value,
  //           id: pointerDownState.hitElement.id,
  //         });
  //       } else {
  //         setComment(null);
  //       }
  //     }
  //   });
  // };
  // const saveComment = () => {
  //   if (!comment) {
  //     return;
  //   }
  //   if (!comment.id && !comment.value) {
  //     setComment(null);
  //     return;
  //   }
  //   const id = comment.id || nanoid();
  //   setCommentIcons({
  //     ...commentIcons,
  //     [id]: {
  //       x: comment.id ? comment.x - 60 : comment.x,
  //       y: comment.y,
  //       id,
  //       value: comment.value,
  //     },
  //   });
  //   setComment(null);
  // };

  // const renderCommentIcons = () => {
  //   return Object.values(commentIcons).map((commentIcon) => {
  //     if (!excalidrawAPI) {
  //       return false;
  //     }
  //     const appState = excalidrawAPI.getAppState();
  //     const { x, y } = sceneCoordsToViewportCoords(
  //       { sceneX: commentIcon.x, sceneY: commentIcon.y },
  //       excalidrawAPI.getAppState()
  //     );
  //     return (
  //       <div
  //         id={commentIcon.id}
  //         key={commentIcon.id}
  //         style={{
  //           top: `${y - COMMENT_ICON_DIMENSION / 2 - appState!.offsetTop}px`,
  //           left: `${x - COMMENT_ICON_DIMENSION / 2 - appState!.offsetLeft}px`,
  //           position: "absolute",
  //           zIndex: 1,
  //           width: `${COMMENT_ICON_DIMENSION}px`,
  //           height: `${COMMENT_ICON_DIMENSION}px`,
  //           cursor: "pointer",
  //           touchAction: "none",
  //         }}
  //         className="comment-icon"
  //         onPointerDown={(event) => {
  //           event.preventDefault();
  //           if (comment) {
  //             commentIcon.value = comment.value;
  //             saveComment();
  //           }
  //           const pointerDownState: any = {
  //             x: event.clientX,
  //             y: event.clientY,
  //             hitElement: commentIcon,
  //             hitElementOffsets: { x: event.clientX - x, y: event.clientY - y },
  //           };
  //           // const onPointerMove =
  //           //   onPointerMoveFromPointerDownHandler(pointerDownState);
  //           // const onPointerUp =
  //           //   onPointerUpFromPointerDownHandler(pointerDownState);
  //           // window.addEventListener("pointermove", onPointerMove);
  //           // window.addEventListener("pointerup", onPointerUp);

  //           // pointerDownState.onMove = onPointerMove;
  //           // pointerDownState.onUp = onPointerUp;

  //           excalidrawAPI?.setActiveTool({
  //             type: "custom",
  //             customType: "comment",
  //           });
  //         }}
  //       >
  //         <div className="comment-avatar">
  //           <img src="doremon.png" alt="doremon" />
  //         </div>
  //       </div>
  //     );
  //   });
  // };

  // const renderComment = () => {
  //   if (!comment) {
  //     return null;
  //   }
  //   const appState = excalidrawAPI?.getAppState()!;
  //   const { x, y } = sceneCoordsToViewportCoords(
  //     { sceneX: comment.x, sceneY: comment.y },
  //     appState
  //   );
  //   let top = y - COMMENT_ICON_DIMENSION / 2 - appState.offsetTop;
  //   let left = x - COMMENT_ICON_DIMENSION / 2 - appState.offsetLeft;

  //   if (
  //     top + COMMENT_INPUT_HEIGHT <
  //     appState.offsetTop + COMMENT_INPUT_HEIGHT
  //   ) {
  //     top = COMMENT_ICON_DIMENSION / 2;
  //   }
  //   if (top + COMMENT_INPUT_HEIGHT > appState.height) {
  //     top = appState.height - COMMENT_INPUT_HEIGHT - COMMENT_ICON_DIMENSION / 2;
  //   }
  //   if (
  //     left + COMMENT_INPUT_WIDTH <
  //     appState.offsetLeft + COMMENT_INPUT_WIDTH
  //   ) {
  //     left = COMMENT_ICON_DIMENSION / 2;
  //   }
  //   if (left + COMMENT_INPUT_WIDTH > appState.width) {
  //     left = appState.width - COMMENT_INPUT_WIDTH - COMMENT_ICON_DIMENSION / 2;
  //   }

  //   return (
  //     <textarea
  //       className="comment"
  //       style={{
  //         top: `${top}px`,
  //         left: `${left}px`,
  //         position: "absolute",
  //         zIndex: 1,
  //         height: `${COMMENT_INPUT_HEIGHT}px`,
  //         width: `${COMMENT_INPUT_WIDTH}px`,
  //       }}
  //       ref={(ref) => {
  //         setTimeout(() => ref?.focus());
  //       }}
  //       placeholder={comment.value ? "Reply" : "Comment"}
  //       value={comment.value}
  //       onChange={(event) => {
  //         setComment({ ...comment, value: event.target.value });
  //       }}
  //       onBlur={saveComment}
  //       onKeyDown={(event) => {
  //         if (!event.shiftKey && event.key === "Enter") {
  //           event.preventDefault();
  //           saveComment();
  //         }
  //       }}
  //     />
  //   );
  // };
  // name="custom" docked={docked} onDock={setDocked}
  // const renderSidebar = () => {
  //   return (
  //     <Sidebar name="custom" docked={docked} onDock={setDocked}>
  //       <Sidebar.Header>Custom header!</Sidebar.Header>
  //       Custom sidebar!
  //     </Sidebar>
  //   );
  // };

  const renderMenu = () => {
    return (
      <MainMenu>
        <MainMenu.DefaultItems.SaveToActiveFile />
        <MainMenu.DefaultItems.LoadScene />
        {/* <MainMenu.DefaultItems. /> */}

        <MainMenu.DefaultItems.SaveAsImage />
        <MainMenu.DefaultItems.Export />
        <MainMenu.DefaultItems.ClearCanvas />
       

        <MainMenu.Separator />
        <MainMenu.DefaultItems.LiveCollaborationTrigger
          isCollaborating={isCollaborating}
          onSelect={() => window.alert("You clicked on collab button")}
        />
        <MainMenu.Separator />

        {/* <MainMenu.Group title="Excalidraw links"> */}
          <MainMenu.DefaultItems.Socials />
        <MainMenu.Separator />
        <MainMenu.DefaultItems.ToggleTheme></MainMenu.DefaultItems.ToggleTheme>
        <MainMenu.DefaultItems.ChangeCanvasBackground />

        {/* </MainMenu.Group> */}
        {/* <MainMenu.Separator /> */}
        {/* <MainMenu.ItemCustom>
          <button
            style={{ height: "2rem" }}
            onClick={() => window.alert("custom menu item")}
          >
            custom item
          </button>
        </MainMenu.ItemCustom> */}
        {/* <MainMenu.DefaultItems.Help /> */}

        {excalidrawAPI && <MobileFooter excalidrawAPI={excalidrawAPI} />}
      </MainMenu>
    );
  };
  return (
    <div className="App" ref={appRef}>
      {/* <h1> Excalidraw Example</h1> */}
      {/* <ExampleSidebar> */}
        <div className="button-wrapper">
          {/* <button className="update-scene" onClick={updateScene}>
            Update Scene
          </button> */}
          <button
            className="reset-scene"
            onClick={() => {
              excalidrawAPI?.resetScene( { resetLoadingState: false });
            }}
          >
            Reset Scene
          </button>
          {/* <button
            onClick={() => {
              const libraryItems: LibraryItems = [
                    {
                      "id": "rwIQLIPEywhYLzIrO5DEM",
                      "status": "published",
                      "elements": [
                        {
                          "type": "rectangle",
                          "version": 775,
                          "versionNonce": 764905813,
                          "isDeleted": false,
                          "id": "RfVTogL5OUQB1NBTazEhE",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1382.0999869714396,
                          "y": 1537.2900814193008,
                          "strokeColor": "#1e1e1e",
                          "backgroundColor": "#1e1e1e",
                          "width": 94.53764672965046,
                          "height": 98.62644982776101,
                          "seed": 1907345786,
                          "groupIds": [
                            "ULKUI84KJJNOFAUY0fYMX"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 3
                          },
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "text",
                          "version": 787,
                          "versionNonce": 1082139259,
                          "isDeleted": false,
                          "id": "o3BxeKGn76L-Hrj-gmBvD",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 0,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1405.5566700882916,
                          "y": 1533.0133066604133,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffc9c9",
                          "width": 50.48237374236459,
                          "height": 97.98597381432278,
                          "seed": 1252821562,
                          "groupIds": [
                            "ULKUI84KJJNOFAUY0fYMX"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false,
                          "fontSize": 78.38877905145823,
                          "fontFamily": 1,
                          "text": "C",
                          "textAlign": "center",
                          "verticalAlign": "top",
                          "containerId": null,
                          "originalText": "C",
                          "lineHeight": 1.25,
                          "baseline": 68.48597381432279
                        },
                        {
                          "type": "rectangle",
                          "version": 739,
                          "versionNonce": 551917237,
                          "isDeleted": false,
                          "id": "tGAyj1e06fM2o0dVucho7",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1409.8573270515014,
                          "y": 1611.1436851869037,
                          "strokeColor": "#fc5d0d",
                          "backgroundColor": "#fc5d0d",
                          "width": 41.40669651794474,
                          "height": 12.29683457975204,
                          "seed": 265499386,
                          "groupIds": [
                            "ULKUI84KJJNOFAUY0fYMX"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 3
                          },
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        }
                      ],
                      "created": 1697101641741,
                      "name": "Camunda black"
                    },
                    {
                      "id": "iMbLNDWMy4LNGmPt99Grg",
                      "status": "published",
                      "elements": [
                        {
                          "type": "rectangle",
                          "version": 1007,
                          "versionNonce": 1161164091,
                          "isDeleted": false,
                          "id": "PgpraPwkB5CwhnLy-nJEy",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1382.931738587829,
                          "y": 1696.1669520273203,
                          "strokeColor": "#fc5d0d",
                          "backgroundColor": "#fc5d0d",
                          "width": 92.87414349687182,
                          "height": 92.01060775198312,
                          "seed": 1134266086,
                          "groupIds": [
                            "NAr7jj_nPUW-rH8LAJOee"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 3
                          },
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "text",
                          "version": 894,
                          "versionNonce": 1228623861,
                          "isDeleted": false,
                          "id": "DGo3Bh7Du3R6ylFSheaU-",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 0,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1406.3448652612606,
                          "y": 1690.0831746196402,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffc9c9",
                          "width": 47.65599822998042,
                          "height": 93.06579525129847,
                          "seed": 1529557926,
                          "groupIds": [
                            "NAr7jj_nPUW-rH8LAJOee"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false,
                          "fontSize": 74.45263620103879,
                          "fontFamily": 1,
                          "text": "C",
                          "textAlign": "center",
                          "verticalAlign": "top",
                          "containerId": null,
                          "originalText": "C",
                          "lineHeight": 1.25,
                          "baseline": 65.56579525129848
                        },
                        {
                          "type": "rectangle",
                          "version": 837,
                          "versionNonce": 1993971163,
                          "isDeleted": false,
                          "id": "mjLUZcoYk1_iJngxa5tXE",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1410.28382318999,
                          "y": 1765.080372181906,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 39.32753832169827,
                          "height": 12.76171304423354,
                          "seed": 667510182,
                          "groupIds": [
                            "NAr7jj_nPUW-rH8LAJOee"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 3
                          },
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        }
                      ],
                      "created": 1697101640316,
                      "name": "Camunda orange"
                    },
                    {
                      "id": "5G155nnQW9H-H_IeYQdIp",
                      "status": "published",
                      "elements": [
                        {
                          "type": "text",
                          "version": 952,
                          "versionNonce": 2062293787,
                          "isDeleted": false,
                          "id": "qejyT78UlLy6sj8o2xBgH",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 0,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1403.422367092358,
                          "y": 1850.7826060908867,
                          "strokeColor": "#1e1e1e",
                          "backgroundColor": "#ffc9c9",
                          "width": 50.231998443603516,
                          "height": 97.98597381432279,
                          "seed": 538012538,
                          "groupIds": [
                            "gjbNG6Xn55SQvTRcGY6FX"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false,
                          "fontSize": 78.38877905145823,
                          "fontFamily": 1,
                          "text": "C",
                          "textAlign": "center",
                          "verticalAlign": "top",
                          "containerId": null,
                          "originalText": "C",
                          "lineHeight": 1.25,
                          "baseline": 68.48597381432279
                        },
                        {
                          "type": "rectangle",
                          "version": 904,
                          "versionNonce": 231405589,
                          "isDeleted": false,
                          "id": "n73LNCBpINJINj-vFGNwc",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1407.5978364061873,
                          "y": 1928.0812330009878,
                          "strokeColor": "#fc5d0d",
                          "backgroundColor": "#fc5d0d",
                          "width": 41.40669651794474,
                          "height": 13.128586196141331,
                          "seed": 1082780730,
                          "groupIds": [
                            "gjbNG6Xn55SQvTRcGY6FX"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 3
                          },
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        }
                      ],
                      "created": 1697101638423,
                      "name": "Camunda white"
                    },
                    {
                      "id": "DrVo2C99av5DOvif4G8_q",
                      "status": "published",
                      "elements": [
                        {
                          "type": "rectangle",
                          "version": 1373,
                          "versionNonce": 449453627,
                          "isDeleted": false,
                          "id": "iA70rmF0p0zL7Y8DiAgnW",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1535.934563627999,
                          "y": 1533.0133066604133,
                          "strokeColor": "#fc5d0d",
                          "backgroundColor": "#fc5d0d",
                          "width": 92.87414349687182,
                          "height": 92.01060775198312,
                          "seed": 426883494,
                          "groupIds": [
                            "VGs3dxNsPFA2XU5b-ACr_",
                            "3gyp2jRmkdb9cgyLTvqlP",
                            "IDZqdfAcS_aKrMLr201h8"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 3
                          },
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "ellipse",
                          "version": 659,
                          "versionNonce": 1696216821,
                          "isDeleted": false,
                          "id": "ssiB1LezjfNyNWKnWm_Z4",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1548.1873411096624,
                          "y": 1574.1808383472255,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 12.57125046341746,
                          "height": 12.152208781303486,
                          "seed": 1060601254,
                          "groupIds": [
                            "3gyp2jRmkdb9cgyLTvqlP",
                            "IDZqdfAcS_aKrMLr201h8"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 704,
                          "versionNonce": 973119195,
                          "isDeleted": false,
                          "id": "ppY22RZAaMRhIkqUoBKCP",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1566.3267043942571,
                          "y": 1574.2262492059822,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 13.026936277925087,
                          "height": 12.398373754754397,
                          "seed": 1377674682,
                          "groupIds": [
                            "3gyp2jRmkdb9cgyLTvqlP",
                            "IDZqdfAcS_aKrMLr201h8"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "diamond",
                          "version": 691,
                          "versionNonce": 1526829141,
                          "isDeleted": false,
                          "id": "-0rSJF74vEHgSpi03hcXs",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1584.5004135125087,
                          "y": 1572.5523807762634,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 14.912623847437521,
                          "height": 15.24961053840144,
                          "seed": 319706170,
                          "groupIds": [
                            "3gyp2jRmkdb9cgyLTvqlP",
                            "IDZqdfAcS_aKrMLr201h8"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "ellipse",
                          "version": 699,
                          "versionNonce": 2078149499,
                          "isDeleted": false,
                          "id": "DqtU__0vw73l9NZnEmBTv",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1604.1453651156326,
                          "y": 1574.2628933383755,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 12.57125046341746,
                          "height": 12.152208781303486,
                          "seed": 72758758,
                          "groupIds": [
                            "3gyp2jRmkdb9cgyLTvqlP",
                            "IDZqdfAcS_aKrMLr201h8"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "text",
                          "version": 902,
                          "versionNonce": 1098300853,
                          "isDeleted": false,
                          "id": "Ku_QPdtH7__3xSX7CM1ic",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1552.9636363377388,
                          "y": 1631.6251904879714,
                          "strokeColor": "#1e1e1e",
                          "backgroundColor": "#fc5d0d",
                          "width": 58.81599807739258,
                          "height": 20,
                          "seed": 1744777396,
                          "groupIds": [
                            "IDZqdfAcS_aKrMLr201h8"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false,
                          "fontSize": 16,
                          "fontFamily": 1,
                          "text": "Modeler",
                          "textAlign": "center",
                          "verticalAlign": "top",
                          "containerId": null,
                          "originalText": "Modeler",
                          "lineHeight": 1.25,
                          "baseline": 14
                        }
                      ],
                      "created": 1697101636590,
                      "name": "Modeler"
                    },
                    {
                      "id": "tF0njRGKbq6hmYtZC-8cf",
                      "status": "published",
                      "elements": [
                        {
                          "type": "rectangle",
                          "version": 1718,
                          "versionNonce": 176935349,
                          "isDeleted": false,
                          "id": "knpGqWzedDPkOpVW69CCJ",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1535.1041196058936,
                          "y": 1850.7826060908867,
                          "strokeColor": "#fc5d0d",
                          "backgroundColor": "#fc5d0d",
                          "width": 92.87414349687182,
                          "height": 92.01060775198312,
                          "seed": 826385594,
                          "groupIds": [
                            "qfXz-f0OS5Ouk5svUEJ9J",
                            "jlRmZ_YHcPdw9-2cAArmp",
                            "QwQJKC0yO24ZgLuL-I_4d",
                            "qEqDmroTPHSPGwOOSxzjb"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 3
                          },
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 1028,
                          "versionNonce": 303763483,
                          "isDeleted": false,
                          "id": "LFspY5nlOP0S4G19cQpsI",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1553.183664133083,
                          "y": 1910.6175811092626,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 23.97500081123343,
                          "height": 8.533509987785633,
                          "seed": 2011507750,
                          "groupIds": [
                            "QwQJKC0yO24ZgLuL-I_4d",
                            "qEqDmroTPHSPGwOOSxzjb"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 950,
                          "versionNonce": 2096222997,
                          "isDeleted": false,
                          "id": "Lyae85GZb6S56m9w0vXl0",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1553.3314248403017,
                          "y": 1875.155696424767,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 58.308891397924974,
                          "height": 8.782224114088335,
                          "seed": 1254580838,
                          "groupIds": [
                            "6CkvrGi51Ii49HZqAUc9z",
                            "QwQJKC0yO24ZgLuL-I_4d",
                            "qEqDmroTPHSPGwOOSxzjb"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "line",
                          "version": 928,
                          "versionNonce": 1645761723,
                          "isDeleted": false,
                          "id": "a7gIbpfFYX65RML6FaiD9",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1555.7161511568447,
                          "y": 1876.7189962659436,
                          "strokeColor": "#fc5d0d",
                          "backgroundColor": "#3070c7",
                          "width": 0,
                          "height": 5.948018968416706,
                          "seed": 1438262694,
                          "groupIds": [
                            "6CkvrGi51Ii49HZqAUc9z",
                            "QwQJKC0yO24ZgLuL-I_4d",
                            "qEqDmroTPHSPGwOOSxzjb"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false,
                          "startBinding": null,
                          "endBinding": null,
                          "lastCommittedPoint": null,
                          "startArrowhead": null,
                          "endArrowhead": null,
                          "points": [
                            [
                              0,
                              0
                            ],
                            [
                              0,
                              5.948018968416706
                            ]
                          ]
                        },
                        {
                          "type": "rectangle",
                          "version": 964,
                          "versionNonce": 701540469,
                          "isDeleted": false,
                          "id": "-QWW-pqDLW92HCbOePvn8",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1553.3535979353333,
                          "y": 1892.2696493502795,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 57.892148014547715,
                          "height": 9.198967497465581,
                          "seed": 857127994,
                          "groupIds": [
                            "_DM4L9l0Pj9LszUu8K75J",
                            "QwQJKC0yO24ZgLuL-I_4d",
                            "qEqDmroTPHSPGwOOSxzjb"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "line",
                          "version": 945,
                          "versionNonce": 390333787,
                          "isDeleted": false,
                          "id": "EiSZY7z5cqqNQkWfqZx39",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1555.4826962821446,
                          "y": 1894.3442051309207,
                          "strokeColor": "#fc5d0d",
                          "backgroundColor": "#3070c7",
                          "width": 0,
                          "height": 5.948018968416706,
                          "seed": 969630266,
                          "groupIds": [
                            "_DM4L9l0Pj9LszUu8K75J",
                            "QwQJKC0yO24ZgLuL-I_4d",
                            "qEqDmroTPHSPGwOOSxzjb"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false,
                          "startBinding": null,
                          "endBinding": null,
                          "lastCommittedPoint": null,
                          "startArrowhead": null,
                          "endArrowhead": null,
                          "points": [
                            [
                              0,
                              0
                            ],
                            [
                              0,
                              5.948018968416706
                            ]
                          ]
                        },
                        {
                          "type": "text",
                          "version": 738,
                          "versionNonce": 1928188373,
                          "isDeleted": false,
                          "id": "pybD99ZHYxIAgahiZfc8F",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1559.669191613729,
                          "y": 1949.4376537219546,
                          "strokeColor": "#1e1e1e",
                          "backgroundColor": "#fc5d0d",
                          "width": 43.74399948120117,
                          "height": 20,
                          "seed": 1254496948,
                          "groupIds": [
                            "qEqDmroTPHSPGwOOSxzjb"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false,
                          "fontSize": 16,
                          "fontFamily": 1,
                          "text": "Forms",
                          "textAlign": "center",
                          "verticalAlign": "top",
                          "containerId": null,
                          "originalText": "Forms",
                          "lineHeight": 1.25,
                          "baseline": 14
                        }
                      ],
                      "created": 1697101634072,
                      "name": "Forms"
                    },
                    {
                      "id": "P77QEuHyKvMCG15Fterco",
                      "status": "published",
                      "elements": [
                        {
                          "type": "rectangle",
                          "version": 1267,
                          "versionNonce": 244594075,
                          "isDeleted": false,
                          "id": "rrq43XpVysHEjjyMYGf8Y",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1535.934563627999,
                          "y": 1690.0831746196402,
                          "strokeColor": "#fc5d0d",
                          "backgroundColor": "#fc5d0d",
                          "width": 92.87414349687182,
                          "height": 92.01060775198312,
                          "seed": 1126303610,
                          "groupIds": [
                            "412G8FxfFoQF6_tsFRh3T",
                            "-53Xa2n7Q_7NaZHTGGGii",
                            "PZeT8VqaLlPU4cT343Fwx"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 3
                          },
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "ellipse",
                          "version": 527,
                          "versionNonce": 2082981269,
                          "isDeleted": false,
                          "id": "GuZcWxoObIYAvZGd9FqJl",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1548.2097024374507,
                          "y": 1730.4194852722458,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 14.330065706893267,
                          "height": 13.852396849996758,
                          "seed": 1103395622,
                          "groupIds": [
                            "uu8vuhsWKspGAyM9TNAwC",
                            "-53Xa2n7Q_7NaZHTGGGii",
                            "PZeT8VqaLlPU4cT343Fwx"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "ellipse",
                          "version": 576,
                          "versionNonce": 256952891,
                          "isDeleted": false,
                          "id": "VJwWz4G7qavBaAyFo7y8D",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1601.2309455529562,
                          "y": 1729.9418164153494,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 14.330065706893267,
                          "height": 13.852396849996758,
                          "seed": 1449149670,
                          "groupIds": [
                            "uu8vuhsWKspGAyM9TNAwC",
                            "-53Xa2n7Q_7NaZHTGGGii",
                            "PZeT8VqaLlPU4cT343Fwx"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "ellipse",
                          "version": 555,
                          "versionNonce": 1654934261,
                          "isDeleted": false,
                          "id": "mQ49VnBaTA4Xh2_qE_Zns",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1575.0121350164939,
                          "y": 1729.6759877944999,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#fc5d0d",
                          "width": 15.812486297261469,
                          "height": 15.285403420686013,
                          "seed": 524329722,
                          "groupIds": [
                            "bklLVjC1disdgCcqc60z7",
                            "uu8vuhsWKspGAyM9TNAwC",
                            "-53Xa2n7Q_7NaZHTGGGii",
                            "PZeT8VqaLlPU4cT343Fwx"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "line",
                          "version": 368,
                          "versionNonce": 1087490779,
                          "isDeleted": false,
                          "id": "c6mG1FBQRbmJG0meuJMtK",
                          "fillStyle": "solid",
                          "strokeWidth": 2,
                          "strokeStyle": "solid",
                          "roughness": 0,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1561.876241451842,
                          "y": 1737.5575239332913,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "transparent",
                          "width": 11.941721422410916,
                          "height": 0.23883442844836145,
                          "seed": 1305870886,
                          "groupIds": [
                            "uu8vuhsWKspGAyM9TNAwC",
                            "-53Xa2n7Q_7NaZHTGGGii",
                            "PZeT8VqaLlPU4cT343Fwx"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false,
                          "startBinding": null,
                          "endBinding": null,
                          "lastCommittedPoint": null,
                          "startArrowhead": null,
                          "endArrowhead": null,
                          "points": [
                            [
                              0,
                              0
                            ],
                            [
                              11.941721422410916,
                              0.23883442844836145
                            ]
                          ]
                        },
                        {
                          "type": "line",
                          "version": 382,
                          "versionNonce": 1177101397,
                          "isDeleted": false,
                          "id": "yt4RiTpuVNqpYN8-G7OXp",
                          "fillStyle": "solid",
                          "strokeWidth": 2,
                          "strokeStyle": "solid",
                          "roughness": 0,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1590.5363728656284,
                          "y": 1737.3186895048432,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "transparent",
                          "width": 11.464052565514404,
                          "height": 0.47766885689651245,
                          "seed": 1086673978,
                          "groupIds": [
                            "uu8vuhsWKspGAyM9TNAwC",
                            "-53Xa2n7Q_7NaZHTGGGii",
                            "PZeT8VqaLlPU4cT343Fwx"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false,
                          "startBinding": null,
                          "endBinding": null,
                          "lastCommittedPoint": null,
                          "startArrowhead": null,
                          "endArrowhead": null,
                          "points": [
                            [
                              0,
                              0
                            ],
                            [
                              11.464052565514404,
                              0.47766885689651245
                            ]
                          ]
                        },
                        {
                          "type": "text",
                          "version": 321,
                          "versionNonce": 1739175803,
                          "isDeleted": false,
                          "id": "UmyHZlDZRRHjH_q63GdEt",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1540.1876372685247,
                          "y": 1787.8625199559021,
                          "strokeColor": "#1e1e1e",
                          "backgroundColor": "#fc5d0d",
                          "width": 84.36799621582031,
                          "height": 20,
                          "seed": 811061940,
                          "groupIds": [
                            "PZeT8VqaLlPU4cT343Fwx"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false,
                          "fontSize": 16,
                          "fontFamily": 1,
                          "text": "Connectors",
                          "textAlign": "center",
                          "verticalAlign": "top",
                          "containerId": null,
                          "originalText": "Connectors",
                          "lineHeight": 1.25,
                          "baseline": 14
                        }
                      ],
                      "created": 1697101632807,
                      "name": "Connectors"
                    },
                    {
                      "id": "s7vfIyFrV6Pd_ghfJdXtw",
                      "status": "published",
                      "elements": [
                        {
                          "type": "rectangle",
                          "version": 1129,
                          "versionNonce": 1200221979,
                          "isDeleted": false,
                          "id": "LGsDPSwotPGoseajbCd3z",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1664.7552658614443,
                          "y": 1533.0133066604133,
                          "strokeColor": "#fc5d0d",
                          "backgroundColor": "#fc5d0d",
                          "width": 92.87414349687182,
                          "height": 92.01060775198312,
                          "seed": 282082470,
                          "groupIds": [
                            "aYz1_kBUab3fZHfprrtlp",
                            "lJSYbfqy6lNFiV_B4YVEB",
                            "K_K2HEmj00w4ZJZsFpfRi",
                            "tdv95NlXEwu78QTJUx1CX"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 3
                          },
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "ellipse",
                          "version": 403,
                          "versionNonce": 1101292565,
                          "isDeleted": false,
                          "id": "GlRaHWx0-Q38AI2Cb4SFw",
                          "fillStyle": "solid",
                          "strokeWidth": 2,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1703.954003665278,
                          "y": 1552.3378083486234,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "transparent",
                          "width": 13.674494522851205,
                          "height": 13.218678038756101,
                          "seed": 2047459622,
                          "groupIds": [
                            "5MBCFU8Ju4GKjtmCsc4Na",
                            "O-VGC-lIhta6wJCYo4KIP",
                            "K_K2HEmj00w4ZJZsFpfRi",
                            "tdv95NlXEwu78QTJUx1CX"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "ellipse",
                          "version": 446,
                          "versionNonce": 1683182523,
                          "isDeleted": false,
                          "id": "BMycqd7e7cIqb1FmNg5t7",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1705.0466488622865,
                          "y": 1594.555929777729,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 11.333044306162641,
                          "height": 10.955276162623834,
                          "seed": 836641082,
                          "groupIds": [
                            "oPdcQuqybIMQJRwjj5kjU",
                            "Z1e3LZrpWu06I5I8WCaOU",
                            "K_K2HEmj00w4ZJZsFpfRi",
                            "tdv95NlXEwu78QTJUx1CX"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "line",
                          "version": 134,
                          "versionNonce": 1007229301,
                          "isDeleted": false,
                          "id": "Ihr0ja_a0QeZfOvDzbvjO",
                          "fillStyle": "solid",
                          "strokeWidth": 2,
                          "strokeStyle": "solid",
                          "roughness": 0,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1710.8565711758938,
                          "y": 1565.5366261505046,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 0,
                          "height": 26.914676597730704,
                          "seed": 1002658426,
                          "groupIds": [
                            "K_K2HEmj00w4ZJZsFpfRi",
                            "tdv95NlXEwu78QTJUx1CX"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false,
                          "startBinding": null,
                          "endBinding": null,
                          "lastCommittedPoint": null,
                          "startArrowhead": null,
                          "endArrowhead": null,
                          "points": [
                            [
                              0,
                              0
                            ],
                            [
                              0,
                              26.914676597730704
                            ]
                          ]
                        },
                        {
                          "type": "line",
                          "version": 189,
                          "versionNonce": 935797851,
                          "isDeleted": false,
                          "id": "4zTveqxCopBf1xZ1_jrLo",
                          "fillStyle": "solid",
                          "strokeWidth": 2,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1685.5356048376827,
                          "y": 1578.4350785101258,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 52.822836304471366,
                          "height": 0,
                          "seed": 1715365307,
                          "groupIds": [
                            "K_K2HEmj00w4ZJZsFpfRi",
                            "tdv95NlXEwu78QTJUx1CX"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false,
                          "startBinding": null,
                          "endBinding": null,
                          "lastCommittedPoint": null,
                          "startArrowhead": null,
                          "endArrowhead": null,
                          "points": [
                            [
                              0,
                              0
                            ],
                            [
                              52.822836304471366,
                              0
                            ]
                          ]
                        },
                        {
                          "type": "line",
                          "version": 122,
                          "versionNonce": 1727013589,
                          "isDeleted": false,
                          "id": "Y7drjAo-KWkimDrpPzcbI",
                          "fillStyle": "solid",
                          "strokeWidth": 2,
                          "strokeStyle": "solid",
                          "roughness": 0,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1684.9485286823117,
                          "y": 1578.5105352287082,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 0.032660124595395246,
                          "height": 14.383257218510607,
                          "seed": 1693877242,
                          "groupIds": [
                            "K_K2HEmj00w4ZJZsFpfRi",
                            "tdv95NlXEwu78QTJUx1CX"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false,
                          "startBinding": null,
                          "endBinding": null,
                          "lastCommittedPoint": null,
                          "startArrowhead": null,
                          "endArrowhead": null,
                          "points": [
                            [
                              0,
                              0
                            ],
                            [
                              -0.032660124595395246,
                              14.383257218510607
                            ]
                          ]
                        },
                        {
                          "type": "line",
                          "version": 135,
                          "versionNonce": 1505222907,
                          "isDeleted": false,
                          "id": "iJz8mWlzb1rYL2HiGDFo0",
                          "fillStyle": "solid",
                          "strokeWidth": 2,
                          "strokeStyle": "solid",
                          "roughness": 0,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1738.6415606901778,
                          "y": 1578.7146170162898,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 0,
                          "height": 13.025804211293462,
                          "seed": 714672742,
                          "groupIds": [
                            "K_K2HEmj00w4ZJZsFpfRi",
                            "tdv95NlXEwu78QTJUx1CX"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false,
                          "startBinding": null,
                          "endBinding": null,
                          "lastCommittedPoint": null,
                          "startArrowhead": null,
                          "endArrowhead": null,
                          "points": [
                            [
                              0,
                              0
                            ],
                            [
                              0,
                              13.025804211293462
                            ]
                          ]
                        },
                        {
                          "type": "ellipse",
                          "version": 525,
                          "versionNonce": 653197365,
                          "isDeleted": false,
                          "id": "1oZvt_ARmSmGkt4lKnOkT",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1732.0615026535556,
                          "y": 1594.1191173639058,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 11.33304430616243,
                          "height": 10.955276162623628,
                          "seed": 223252646,
                          "groupIds": [
                            "W0lFiLY_zbR3gBKIibw6H",
                            "kyeuB25RtCFrvx6hU8JDi",
                            "K_K2HEmj00w4ZJZsFpfRi",
                            "tdv95NlXEwu78QTJUx1CX"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "ellipse",
                          "version": 455,
                          "versionNonce": 1135085979,
                          "isDeleted": false,
                          "id": "gIB-2_OACKta9g-3wHMY4",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1679.8276271545171,
                          "y": 1594.8396722338093,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 11.33304430616283,
                          "height": 10.955276162624015,
                          "seed": 1986936826,
                          "groupIds": [
                            "PSGsfFYtIxrdh64qWM36J",
                            "6qPOwiy138XO-04YsvZsK",
                            "K_K2HEmj00w4ZJZsFpfRi",
                            "tdv95NlXEwu78QTJUx1CX"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "text",
                          "version": 447,
                          "versionNonce": 1734751483,
                          "isDeleted": false,
                          "id": "CcNkFMTWaLDwTE_3pK8mW",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1666.9763380066086,
                          "y": 1631.625617105873,
                          "strokeColor": "#1e1e1e",
                          "backgroundColor": "#fc5d0d",
                          "width": 88.43199920654297,
                          "height": 40,
                          "seed": 271549324,
                          "groupIds": [
                            "tdv95NlXEwu78QTJUx1CX"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101562206,
                          "link": null,
                          "locked": false,
                          "fontSize": 16,
                          "fontFamily": 1,
                          "text": "Integration\nFramework",
                          "textAlign": "center",
                          "verticalAlign": "top",
                          "containerId": null,
                          "originalText": "Integration\nFramework",
                          "lineHeight": 1.25,
                          "baseline": 34
                        }
                      ],
                      "created": 1697101630006,
                      "name": "Integration Framework"
                    },
                    {
                      "id": "UrpdLTx-8nsOVRv7SNPWP",
                      "status": "published",
                      "elements": [
                        {
                          "type": "rectangle",
                          "version": 1368,
                          "versionNonce": 55422485,
                          "isDeleted": false,
                          "id": "0HR9FHSOGO9qsDBKHJxul",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1800.5767497393722,
                          "y": 1533.0133066604133,
                          "strokeColor": "#3070c7",
                          "backgroundColor": "#3070c7",
                          "width": 92.87414349687182,
                          "height": 92.01060775198312,
                          "seed": 756616186,
                          "groupIds": [
                            "LkkKJQYPsSvZY6MCLfpqs",
                            "dSYn2IcbAbt9woC2iN0uL",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 3
                          },
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 414,
                          "versionNonce": 1681631675,
                          "isDeleted": false,
                          "id": "uWvQv359AeXKidQZDHE_z",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1834.9569464423691,
                          "y": 1555.017303870737,
                          "strokeColor": "transparent",
                          "backgroundColor": "#ffffff",
                          "width": 10.610539272193195,
                          "height": 6.4071593274979755,
                          "seed": 1620172474,
                          "groupIds": [
                            "hFf7ntw1xmSlb32uFNiDY",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "ellipse",
                          "version": 454,
                          "versionNonce": 1308173173,
                          "isDeleted": false,
                          "id": "BIu1WtW7AsnkLGSFxkHjZ",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1824.4976167032098,
                          "y": 1560.799504640637,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#2f6ec6",
                          "width": 31.326354041713515,
                          "height": 29.305298942248204,
                          "seed": 1461319546,
                          "groupIds": [
                            "hFf7ntw1xmSlb32uFNiDY",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 574,
                          "versionNonce": 70564443,
                          "isDeleted": false,
                          "id": "gUwfLazdhnjKx8tZ-2gXe",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 1.5707963267948957,
                          "x": 1852.6172108361802,
                          "y": 1572.042274736937,
                          "strokeColor": "transparent",
                          "backgroundColor": "#ffffff",
                          "width": 10.610539272193195,
                          "height": 6.4071593274979755,
                          "seed": 118087930,
                          "groupIds": [
                            "hFf7ntw1xmSlb32uFNiDY",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 621,
                          "versionNonce": 307162325,
                          "isDeleted": false,
                          "id": "-73CRaq4Hicgkea3RYVWu",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 1.5707963267948957,
                          "x": 1816.0571352166592,
                          "y": 1572.7453531142357,
                          "strokeColor": "transparent",
                          "backgroundColor": "#ffffff",
                          "width": 10.610539272193195,
                          "height": 6.4071593274979755,
                          "seed": 1809297850,
                          "groupIds": [
                            "hFf7ntw1xmSlb32uFNiDY",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 695,
                          "versionNonce": 805484283,
                          "isDeleted": false,
                          "id": "naOiV7Tg-3Vggq3Ryxko1",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 2.356194490192344,
                          "x": 1821.1349234971487,
                          "y": 1559.9337026834633,
                          "strokeColor": "transparent",
                          "backgroundColor": "#ffffff",
                          "width": 10.610539272193195,
                          "height": 6.4071593274979755,
                          "seed": 1076718202,
                          "groupIds": [
                            "hFf7ntw1xmSlb32uFNiDY",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 731,
                          "versionNonce": 1340377653,
                          "isDeleted": false,
                          "id": "nJ46fh5Yo_ItA-Bu1CSmY",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 2.356194490192344,
                          "x": 1847.695662195091,
                          "y": 1585.4788837253082,
                          "strokeColor": "transparent",
                          "backgroundColor": "#ffffff",
                          "width": 10.610539272193195,
                          "height": 6.4071593274979755,
                          "seed": 449710906,
                          "groupIds": [
                            "hFf7ntw1xmSlb32uFNiDY",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 779,
                          "versionNonce": 1982341019,
                          "isDeleted": false,
                          "id": "BHRYpXc6M_CeoCYkwX4GE",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 3.9269908169872405,
                          "x": 1821.9161216941468,
                          "y": 1585.5570035450078,
                          "strokeColor": "transparent",
                          "backgroundColor": "#ffffff",
                          "width": 10.610539272193195,
                          "height": 6.4071593274979755,
                          "seed": 1109169146,
                          "groupIds": [
                            "hFf7ntw1xmSlb32uFNiDY",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 827,
                          "versionNonce": 2006940565,
                          "isDeleted": false,
                          "id": "aYIGpWk7bbSChZfiyXaiT",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 3.9269908169872405,
                          "x": 1848.1643811132892,
                          "y": 1559.4649837652646,
                          "strokeColor": "transparent",
                          "backgroundColor": "#ffffff",
                          "width": 10.610539272193195,
                          "height": 6.4071593274979755,
                          "seed": 941360314,
                          "groupIds": [
                            "hFf7ntw1xmSlb32uFNiDY",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 644,
                          "versionNonce": 1893168187,
                          "isDeleted": false,
                          "id": "k3nNnkIF93mO0ZU-vZfi7",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1849.1056884837144,
                          "y": 1564.342906217855,
                          "strokeColor": "#2f6ec6",
                          "backgroundColor": "#ffffff",
                          "width": 10.610539272193195,
                          "height": 6.4071593274979755,
                          "seed": 191752378,
                          "groupIds": [
                            "hFf7ntw1xmSlb32uFNiDY",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 516,
                          "versionNonce": 1102397685,
                          "isDeleted": false,
                          "id": "tTy7TBn7qnKkjkl97_VRP",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1850.1466723189221,
                          "y": 1600.916333375741,
                          "strokeColor": "transparent",
                          "backgroundColor": "#ffffff",
                          "width": 10.610539272193195,
                          "height": 6.4071593274979755,
                          "seed": 323205478,
                          "groupIds": [
                            "hFf7ntw1xmSlb32uFNiDY",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 592,
                          "versionNonce": 1341338843,
                          "isDeleted": false,
                          "id": "3StJcKjN8NtugyNyt1fPl",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 1.5707963267948957,
                          "x": 1867.8017515710837,
                          "y": 1582.7144153856802,
                          "strokeColor": "transparent",
                          "backgroundColor": "#ffffff",
                          "width": 10.610539272193195,
                          "height": 6.4071593274979755,
                          "seed": 1771506554,
                          "groupIds": [
                            "hFf7ntw1xmSlb32uFNiDY",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 643,
                          "versionNonce": 1135303253,
                          "isDeleted": false,
                          "id": "imtehybcCBeVd0sNqp_RF",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 1.5707963267948957,
                          "x": 1831.241675951563,
                          "y": 1583.417493762979,
                          "strokeColor": "#1971c2",
                          "backgroundColor": "#ffffff",
                          "width": 10.610539272193195,
                          "height": 6.4071593274979755,
                          "seed": 539938554,
                          "groupIds": [
                            "hFf7ntw1xmSlb32uFNiDY",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 713,
                          "versionNonce": 588112251,
                          "isDeleted": false,
                          "id": "rRma9PjEn8ZRn7FSD3A7o",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 2.356194490192344,
                          "x": 1836.319464232052,
                          "y": 1570.6058433322064,
                          "strokeColor": "transparent",
                          "backgroundColor": "#ffffff",
                          "width": 10.610539272193195,
                          "height": 6.4071593274979755,
                          "seed": 1655952058,
                          "groupIds": [
                            "hFf7ntw1xmSlb32uFNiDY",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 749,
                          "versionNonce": 1180125109,
                          "isDeleted": false,
                          "id": "ApDz6-Loh1ubAD_TOfNXR",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 2.356194490192344,
                          "x": 1862.8802029299945,
                          "y": 1596.1510243740513,
                          "strokeColor": "transparent",
                          "backgroundColor": "#ffffff",
                          "width": 10.610539272193195,
                          "height": 6.4071593274979755,
                          "seed": 861579302,
                          "groupIds": [
                            "hFf7ntw1xmSlb32uFNiDY",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 797,
                          "versionNonce": 1667889691,
                          "isDeleted": false,
                          "id": "x1meNDoYvlNF7C0Ni8Y0a",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 3.9269908169872405,
                          "x": 1837.10066242905,
                          "y": 1596.2291441937512,
                          "strokeColor": "transparent",
                          "backgroundColor": "#ffffff",
                          "width": 10.610539272193195,
                          "height": 6.4071593274979755,
                          "seed": 1729947898,
                          "groupIds": [
                            "hFf7ntw1xmSlb32uFNiDY",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 845,
                          "versionNonce": 1541310741,
                          "isDeleted": false,
                          "id": "Ug_6wAXw8g-mMOVIMwfnw",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 3.9269908169872405,
                          "x": 1863.348921848193,
                          "y": 1570.1371244140075,
                          "strokeColor": "transparent",
                          "backgroundColor": "#ffffff",
                          "width": 10.610539272193195,
                          "height": 6.4071593274979755,
                          "seed": 2006410790,
                          "groupIds": [
                            "hFf7ntw1xmSlb32uFNiDY",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "ellipse",
                          "version": 473,
                          "versionNonce": 1039793851,
                          "isDeleted": false,
                          "id": "-v3paQhmvR_55qdvbHZv7",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1839.6821574381133,
                          "y": 1571.4716452893801,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#2f6ec6",
                          "width": 31.326354041713515,
                          "height": 29.305298942248204,
                          "seed": 890195706,
                          "groupIds": [
                            "hFf7ntw1xmSlb32uFNiDY",
                            "Fyy4k8jdXNm9y0qNZKGgo",
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 2
                          },
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "text",
                          "version": 312,
                          "versionNonce": 901160565,
                          "isDeleted": false,
                          "id": "mBEIBFJkpVN0WZBwntBbt",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1813.9818199924468,
                          "y": 1631.408576135515,
                          "strokeColor": "#1e1e1e",
                          "backgroundColor": "#fc5d0d",
                          "width": 66.06400299072266,
                          "height": 40,
                          "seed": 1089687860,
                          "groupIds": [
                            "0oinneHEN68J5rtOOsJAa"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false,
                          "fontSize": 16,
                          "fontFamily": 1,
                          "text": "Workflow\nEngine",
                          "textAlign": "center",
                          "verticalAlign": "top",
                          "containerId": null,
                          "originalText": "Workflow\nEngine",
                          "lineHeight": 1.25,
                          "baseline": 34
                        }
                      ],
                      "created": 1697101626073,
                      "name": "Workflow Engine"
                    },
                    {
                      "id": "w1qH7UREF2ing66qdA0q-",
                      "status": "published",
                      "elements": [
                        {
                          "type": "rectangle",
                          "version": 1495,
                          "versionNonce": 562470715,
                          "isDeleted": false,
                          "id": "9Q1qIvDjI6bHTLvU3SQsl",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1800.5767497393722,
                          "y": 1692.5745066859556,
                          "strokeColor": "#3070c7",
                          "backgroundColor": "#3070c7",
                          "width": 92.87414349687182,
                          "height": 92.01060775198312,
                          "seed": 2034790458,
                          "groupIds": [
                            "kymyx4y0aW2z8uocDss5b",
                            "3FLXntV5md_qnUG_LQi39",
                            "PkQphCCKNHDcmI7MTvBUo",
                            "S9GhAuU1qD4tHonEgyQ9E"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 3
                          },
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 412,
                          "versionNonce": 388122101,
                          "isDeleted": false,
                          "id": "4K0T0rte4FoQcaocecdTy",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1817.044171715202,
                          "y": 1714.5517982443598,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 60.682935496027525,
                          "height": 10.881826759614341,
                          "seed": 475899706,
                          "groupIds": [
                            "fZhcMVWxImYNmztJzdw0J",
                            "PkQphCCKNHDcmI7MTvBUo",
                            "S9GhAuU1qD4tHonEgyQ9E"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 485,
                          "versionNonce": 394592219,
                          "isDeleted": false,
                          "id": "mltWe3R_zflOoNJmHs4ut",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1837.8507096352978,
                          "y": 1731.1566442819108,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 40.74924650797789,
                          "height": 9.648687837192483,
                          "seed": 803895910,
                          "groupIds": [
                            "Q4Nx1Z5NiVCmMu5c9v176",
                            "PkQphCCKNHDcmI7MTvBUo",
                            "S9GhAuU1qD4tHonEgyQ9E"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 491,
                          "versionNonce": 1328529237,
                          "isDeleted": false,
                          "id": "oKYpR7JRvdRgtnhHYbK0-",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1837.9511054031389,
                          "y": 1748.4238364644837,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 40.59434930885846,
                          "height": 9.131714394439086,
                          "seed": 346721978,
                          "groupIds": [
                            "rCOpz3OqYHeX37GJSSNYH",
                            "PkQphCCKNHDcmI7MTvBUo",
                            "S9GhAuU1qD4tHonEgyQ9E"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 540,
                          "versionNonce": 1278102651,
                          "isDeleted": false,
                          "id": "adkMdhY8PjIjmQpCuli2O",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1817.1672382234435,
                          "y": 1732.0684656622302,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 14.462955483166976,
                          "height": 9.546101376116667,
                          "seed": 203054822,
                          "groupIds": [
                            "abnLIfhBPkvf2mI5yzQFQ",
                            "PkQphCCKNHDcmI7MTvBUo",
                            "S9GhAuU1qD4tHonEgyQ9E"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 546,
                          "versionNonce": 235343029,
                          "isDeleted": false,
                          "id": "SY92NPvbsmQPpoA9f89Gv",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1817.8838159767156,
                          "y": 1747.61902606357,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 14.462955483166976,
                          "height": 9.546101376116667,
                          "seed": 2096150650,
                          "groupIds": [
                            "1rMvJLrf7JTtUccR4vc-I",
                            "PkQphCCKNHDcmI7MTvBUo",
                            "S9GhAuU1qD4tHonEgyQ9E"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "text",
                          "version": 301,
                          "versionNonce": 54854939,
                          "isDeleted": false,
                          "id": "8QYVtwCo4V5_yAPshoK3X",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1816.3658226779937,
                          "y": 1792.3718252135711,
                          "strokeColor": "#1e1e1e",
                          "backgroundColor": "#fc5d0d",
                          "width": 61.295997619628906,
                          "height": 40,
                          "seed": 2143964212,
                          "groupIds": [
                            "S9GhAuU1qD4tHonEgyQ9E"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false,
                          "fontSize": 16,
                          "fontFamily": 1,
                          "text": "Decision\nEngine",
                          "textAlign": "center",
                          "verticalAlign": "top",
                          "containerId": null,
                          "originalText": "Decision\nEngine",
                          "lineHeight": 1.25,
                          "baseline": 34
                        }
                      ],
                      "created": 1697101624210,
                      "name": "Decision Engine"
                    },
                    {
                      "id": "QCUEP60nyQc-I6yNmhOEp",
                      "status": "published",
                      "elements": [
                        {
                          "type": "rectangle",
                          "version": 1555,
                          "versionNonce": 1492165115,
                          "isDeleted": false,
                          "id": "hyfXO3haKZ81JntcLD3Y0",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1799.746305717267,
                          "y": 1850.7826060908867,
                          "strokeColor": "#3070c7",
                          "backgroundColor": "#3070c7",
                          "width": 92.87414349687182,
                          "height": 92.01060775198312,
                          "seed": 347206138,
                          "groupIds": [
                            "EIZ9KeiH8ylCun7lEi7cF",
                            "6rWTReKrCxMpyzoll6a9t",
                            "a5Rt68rol2Fs73otchum5",
                            "hqQPkmpdGi5tUASS0UIAs"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 3
                          },
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 368,
                          "versionNonce": 1700712245,
                          "isDeleted": false,
                          "id": "C0meFAONOk5JRls04N4FJ",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0.7853981633974474,
                          "x": 1845.9024845929887,
                          "y": 1871.353052977408,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 10.190402081090484,
                          "height": 52.30363322261314,
                          "seed": 806859962,
                          "groupIds": [
                            "a5Rt68rol2Fs73otchum5",
                            "hqQPkmpdGi5tUASS0UIAs"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "rectangle",
                          "version": 458,
                          "versionNonce": 1075882651,
                          "isDeleted": false,
                          "id": "4FUgq8cLh3I9Jms__qJjm",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 5.497787143782138,
                          "x": 1824.19308823606,
                          "y": 1898.2794778139728,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 8.09161458816402,
                          "height": 15.086333434920546,
                          "seed": 1738511098,
                          "groupIds": [
                            "a5Rt68rol2Fs73otchum5",
                            "hqQPkmpdGi5tUASS0UIAs"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486739,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "text",
                          "version": 276,
                          "versionNonce": 392200309,
                          "isDeleted": false,
                          "id": "W0DuANqUgCmSGYLPMokYt",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1813.4553768248336,
                          "y": 1949.7694509421394,
                          "strokeColor": "#1e1e1e",
                          "backgroundColor": "#fc5d0d",
                          "width": 65.45600128173828,
                          "height": 20,
                          "seed": 34589620,
                          "groupIds": [
                            "hqQPkmpdGi5tUASS0UIAs"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101585520,
                          "link": null,
                          "locked": false,
                          "fontSize": 16,
                          "fontFamily": 1,
                          "text": "Tasklist",
                          "textAlign": "center",
                          "verticalAlign": "top",
                          "containerId": null,
                          "originalText": "Tasklist",
                          "lineHeight": 1.25,
                          "baseline": 14
                        }
                      ],
                      "created": 1697101622120,
                      "name": "Tasklist"
                    },
                    {
                      "id": "TH6BzY_2NJIxhLVAAYbQY",
                      "status": "published",
                      "elements": [
                        {
                          "type": "rectangle",
                          "version": 1575,
                          "versionNonce": 492859227,
                          "isDeleted": false,
                          "id": "hE0tWwtgizBe9RZ574uP-",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1936.9650530586946,
                          "y": 1533.0133066604133,
                          "strokeColor": "#3070c7",
                          "backgroundColor": "#3070c7",
                          "width": 92.87414349687182,
                          "height": 92.01060775198312,
                          "seed": 767442682,
                          "groupIds": [
                            "qiB1J5sRZ9B2L8g-1clU1",
                            "8Y53hS6dscaqFJTHtyacc",
                            "pU_rnpXc-IF_MEDnx7rOt",
                            "JPtHrVpWFHek74k34hlh2",
                            "8Os_y4dRBbxdNJQIFRK9v"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 3
                          },
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "line",
                          "version": 172,
                          "versionNonce": 983893973,
                          "isDeleted": false,
                          "id": "DRotP0AxBTGm67Mf9e-48",
                          "fillStyle": "solid",
                          "strokeWidth": 2,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1949.938525841022,
                          "y": 1583.4630789170817,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 15.913402948385926,
                          "height": 0.12219184099215369,
                          "seed": 1022511674,
                          "groupIds": [
                            "1oadsrnExdstrrq9WmS4e",
                            "JPtHrVpWFHek74k34hlh2",
                            "8Os_y4dRBbxdNJQIFRK9v"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false,
                          "startBinding": null,
                          "endBinding": null,
                          "lastCommittedPoint": null,
                          "startArrowhead": null,
                          "endArrowhead": null,
                          "points": [
                            [
                              0,
                              0
                            ],
                            [
                              15.913402948385926,
                              -0.12219184099215369
                            ]
                          ]
                        },
                        {
                          "type": "line",
                          "version": 233,
                          "versionNonce": 1945095163,
                          "isDeleted": false,
                          "id": "fM8RdzokYZRjSBQVFi6gZ",
                          "fillStyle": "solid",
                          "strokeWidth": 2,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1989.0358695457296,
                          "y": 1581.8416650556517,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 26.68526070196549,
                          "height": 1.1232408035948538,
                          "seed": 950559354,
                          "groupIds": [
                            "1oadsrnExdstrrq9WmS4e",
                            "JPtHrVpWFHek74k34hlh2",
                            "8Os_y4dRBbxdNJQIFRK9v"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false,
                          "startBinding": null,
                          "endBinding": null,
                          "lastCommittedPoint": null,
                          "startArrowhead": null,
                          "endArrowhead": null,
                          "points": [
                            [
                              0,
                              0
                            ],
                            [
                              26.68526070196549,
                              1.1232408035948538
                            ]
                          ]
                        },
                        {
                          "type": "line",
                          "version": 294,
                          "versionNonce": 1556038965,
                          "isDeleted": false,
                          "id": "TP6JPO1YnkUw-0yMxKJlU",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1976.0731105250115,
                          "y": 1561.80327080196,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 5.6466863751561505,
                          "height": 37.96912436052685,
                          "seed": 365259386,
                          "groupIds": [
                            "1oadsrnExdstrrq9WmS4e",
                            "JPtHrVpWFHek74k34hlh2",
                            "8Os_y4dRBbxdNJQIFRK9v"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false,
                          "startBinding": null,
                          "endBinding": null,
                          "lastCommittedPoint": null,
                          "startArrowhead": null,
                          "endArrowhead": null,
                          "points": [
                            [
                              0,
                              0
                            ],
                            [
                              5.6466863751561505,
                              37.96912436052685
                            ]
                          ]
                        },
                        {
                          "type": "line",
                          "version": 194,
                          "versionNonce": 1168807067,
                          "isDeleted": false,
                          "id": "0jI_jVvQeyBXr_gRH3xMc",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1967.7318348736214,
                          "y": 1582.2129434255614,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 6.015699469483024,
                          "height": 20.678966926348625,
                          "seed": 1925285242,
                          "groupIds": [
                            "1oadsrnExdstrrq9WmS4e",
                            "JPtHrVpWFHek74k34hlh2",
                            "8Os_y4dRBbxdNJQIFRK9v"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false,
                          "startBinding": null,
                          "endBinding": null,
                          "lastCommittedPoint": null,
                          "startArrowhead": null,
                          "endArrowhead": null,
                          "points": [
                            [
                              0,
                              0
                            ],
                            [
                              6.015699469483024,
                              -20.678966926348625
                            ]
                          ]
                        },
                        {
                          "type": "line",
                          "version": 351,
                          "versionNonce": 795530901,
                          "isDeleted": false,
                          "id": "uJQsiBnHtwVNYQDA89GK6",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1981.6557352825248,
                          "y": 1599.8831406579252,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#ffffff",
                          "width": 7.8830101679731115,
                          "height": 17.67019723236378,
                          "seed": 151158950,
                          "groupIds": [
                            "1oadsrnExdstrrq9WmS4e",
                            "JPtHrVpWFHek74k34hlh2",
                            "8Os_y4dRBbxdNJQIFRK9v"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false,
                          "startBinding": null,
                          "endBinding": null,
                          "lastCommittedPoint": null,
                          "startArrowhead": null,
                          "endArrowhead": null,
                          "points": [
                            [
                              0,
                              0
                            ],
                            [
                              7.8830101679731115,
                              -17.67019723236378
                            ]
                          ]
                        },
                        {
                          "type": "text",
                          "version": 347,
                          "versionNonce": 1917012283,
                          "isDeleted": false,
                          "id": "skVAa80-8_z6D8VBZZulE",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 1951.6021236627212,
                          "y": 1630.9240898570288,
                          "strokeColor": "#1e1e1e",
                          "backgroundColor": "#fc5d0d",
                          "width": 63.60000228881836,
                          "height": 20,
                          "seed": 1981172492,
                          "groupIds": [
                            "8Os_y4dRBbxdNJQIFRK9v"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false,
                          "fontSize": 16,
                          "fontFamily": 1,
                          "text": "Operate",
                          "textAlign": "center",
                          "verticalAlign": "top",
                          "containerId": null,
                          "originalText": "Operate",
                          "lineHeight": 1.25,
                          "baseline": 14
                        }
                      ],
                      "created": 1697101620128,
                      "name": "Operate"
                    },
                    {
                      "id": "hz06k6kLMNQt6DwOSsjC4",
                      "status": "published",
                      "elements": [
                        {
                          "type": "rectangle",
                          "version": 1557,
                          "versionNonce": 1029520373,
                          "isDeleted": false,
                          "id": "NiTzcmctSXzuV098CnsFN",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 2083.5539824712296,
                          "y": 1533.0133066604133,
                          "strokeColor": "#64cd87",
                          "backgroundColor": "#64cd87",
                          "width": 92.87414349687182,
                          "height": 92.01060775198312,
                          "seed": 112469242,
                          "groupIds": [
                            "f7kGViE79ccCkonN6VlOL",
                            "ZeFxH4SztCfHjt3jZRRzg",
                            "CpMPDcO9MlFqXxPMVKYNJ",
                            "flTv_NX11pjmAQ5AKjOt9"
                          ],
                          "frameId": null,
                          "roundness": {
                            "type": 3
                          },
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false
                        },
                        {
                          "type": "arrow",
                          "version": 750,
                          "versionNonce": 1058826715,
                          "isDeleted": false,
                          "id": "uP3mFyTCKxLrYi9z8Au4o",
                          "fillStyle": "solid",
                          "strokeWidth": 4,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 2135.5207945350767,
                          "y": 1598.648233983133,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#64cd87",
                          "width": 21.905938191508994,
                          "height": 44.2430818586231,
                          "seed": 1847458342,
                          "groupIds": [
                            "0M6mCPQRa9_FS6ekWf3WE",
                            "CpMPDcO9MlFqXxPMVKYNJ",
                            "flTv_NX11pjmAQ5AKjOt9"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false,
                          "startBinding": null,
                          "endBinding": null,
                          "lastCommittedPoint": null,
                          "startArrowhead": null,
                          "endArrowhead": "triangle",
                          "points": [
                            [
                              0,
                              0
                            ],
                            [
                              0.4983953478026706,
                              -27.428369806096498
                            ],
                            [
                              21.905938191508994,
                              -44.2430818586231
                            ]
                          ]
                        },
                        {
                          "type": "line",
                          "version": 229,
                          "versionNonce": 513537365,
                          "isDeleted": false,
                          "id": "55wmSJ7lIOzRGI2iBj1Yo",
                          "fillStyle": "solid",
                          "strokeWidth": 2,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 2135.7259674572283,
                          "y": 1601.399490498988,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#64cd87",
                          "width": 17.529362730276716,
                          "height": 5.676604519115699,
                          "seed": 2027301030,
                          "groupIds": [
                            "0M6mCPQRa9_FS6ekWf3WE",
                            "CpMPDcO9MlFqXxPMVKYNJ",
                            "flTv_NX11pjmAQ5AKjOt9"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false,
                          "startBinding": null,
                          "endBinding": null,
                          "lastCommittedPoint": null,
                          "startArrowhead": null,
                          "endArrowhead": null,
                          "points": [
                            [
                              0,
                              0
                            ],
                            [
                              -17.529362730276716,
                              -5.676604519115699
                            ]
                          ]
                        },
                        {
                          "type": "line",
                          "version": 221,
                          "versionNonce": 558397051,
                          "isDeleted": false,
                          "id": "p9l8jDc38GemJWzuZ-BpT",
                          "fillStyle": "solid",
                          "strokeWidth": 2,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 2119.9402104293736,
                          "y": 1594.566044285946,
                          "strokeColor": "#ffffff",
                          "backgroundColor": "#64cd87",
                          "width": 16.970048295449942,
                          "height": 7.887337310029579,
                          "seed": 1390319590,
                          "groupIds": [
                            "0M6mCPQRa9_FS6ekWf3WE",
                            "CpMPDcO9MlFqXxPMVKYNJ",
                            "flTv_NX11pjmAQ5AKjOt9"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false,
                          "startBinding": null,
                          "endBinding": null,
                          "lastCommittedPoint": null,
                          "startArrowhead": null,
                          "endArrowhead": null,
                          "points": [
                            [
                              0,
                              0
                            ],
                            [
                              -16.970048295449942,
                              7.887337310029579
                            ]
                          ]
                        },
                        {
                          "type": "text",
                          "version": 378,
                          "versionNonce": 1316782773,
                          "isDeleted": false,
                          "id": "pZc43Z2lQ6UkilTCugung",
                          "fillStyle": "solid",
                          "strokeWidth": 1,
                          "strokeStyle": "solid",
                          "roughness": 1,
                          "opacity": 100,
                          "angle": 0,
                          "x": 2098.1990524954226,
                          "y": 1631.7211950727008,
                          "strokeColor": "#1e1e1e",
                          "backgroundColor": "#fc5d0d",
                          "width": 63.58400344848633,
                          "height": 20,
                          "seed": 1696790452,
                          "groupIds": [
                            "flTv_NX11pjmAQ5AKjOt9"
                          ],
                          "frameId": null,
                          "roundness": null,
                          "boundElements": [],
                          "updated": 1697101486740,
                          "link": null,
                          "locked": false,
                          "fontSize": 16,
                          "fontFamily": 1,
                          "text": "Optimize",
                          "textAlign": "center",
                          "verticalAlign": "top",
                          "containerId": null,
                          "originalText": "Optimize",
                          "lineHeight": 1.25,
                          "baseline": 14
                        }
                      ],
                      "created": 1697101618502,
                      "name": "Optimize"
                    }
                  
                
                
              ];
              excalidrawAPI?.updateLibrary({
                libraryItems,
              });
            }}
          >
            Update Library
          </button> */}
          <button onClick={onCopy.bind(null, "png")}>
              Copy to Clipboard as PNG
            </button>
            <button onClick={onCopy.bind(null, "svg")}>
              Copy to Clipboard as SVG
            </button>
            <button onClick={onCopy.bind(null, "json")}>
              Copy to Clipboard as JSON
            </button>
       
          <div className="mt-1">
          <label>
            <input
              type="checkbox"
              checked={viewModeEnabled}
              onChange={() => setViewModeEnabled(!viewModeEnabled)
              }
            />
            View mode
          </label>
          <label>
            <input
              type="checkbox"
              checked={zenModeEnabled}
              onChange={() => setZenModeEnabled(!zenModeEnabled)}
            />
            Zen mode
          </label>
          <label>
            <input
              type="checkbox"
              checked={gridModeEnabled}
              onChange={() => setGridModeEnabled(!gridModeEnabled)}
            />
            Grid mode
          </label>
          {/* <label>
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={() => {
                let newTheme = "light";
                if (theme === "light") {
                  newTheme = "dark";
                }
                setTheme(newTheme);
              }}
            />
            Switch to Dark Theme
          </label> */}
          <label>
            <input
              type="checkbox"
              checked={isCollaborating}
              onChange={() => {
                if (!isCollaborating) {
                  const collaborators = new Map();
                  collaborators.set("id1", {
                    username: "Doremon",
                    avatarUrl: "doremon.png",
                  });
                  collaborators.set("id2", {
                    username: "Excalibot",
                    avatarUrl: "excalibot.png",
                  });
                  collaborators.set("id3", {
                    username: "Pika",
                    avatarUrl: "pika.jpeg",
                  });
                  collaborators.set("id4", {
                    username: "fallback",
                    avatarUrl: "https://example.com",
                  });
                  excalidrawAPI?.updateScene({ collaborators });
                } else {
                  excalidrawAPI?.updateScene({
                    collaborators: new Map(),
                  });
                }
                setIsCollaborating(!isCollaborating);
              }}
            />
            Show collaborators
          </label>

          
          </div>
          <div
            style={{
              display: "flex",
              gap: "1em",
              justifyContent: "center",
              marginTop: "1em",
            }}
          >
            {/* <div>x: {pointerData?.pointer.x ?? 0}</div> */}
            {/* <div>y: {pointerData?.pointer.y ?? 0}</div> */}
          </div>
        </div>
        <div className="excalidraw-wrapper">
          {/* <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "20px",
              display: "flex",
              zIndex: 9999999999999999,
              padding: "5px 10px",
              transform: "translateX(-50%)",
              background: "rgba(255, 255, 255, 0.8)",
              gap: "1rem",
            }}
          >
            <button onClick={() => excalidrawAPI?.toggleSidebar({name: "custom"})}>
              Toggle Custom Sidebar
            </button>
          </div> */}

          {/* <button
        className="custom-button"
        onClick={() => {
          const libraryItems = [
            {
              status: "published",
              id: "1",
              created: 1,
              elements: initialData.libraryItems[1],
            },
            {
              status: "unpublished",
              id: "2",
              created: 2,
              elements: initialData.libraryItems[1],
            },
          ];
          excalidrawAPI?.updateLibrary({
            libraryItems,
            openLibraryMenu: true,
          });
        }}
      >
        Update Library
      </button> */}
          <Excalidraw

            excalidrawAPI={(api: ExcalidrawImperativeAPI) =>
              setExcalidrawAPI(api)
            }
            initialData={initialStatePromiseRef.current.promise}
            onChange={(elements, state) => {
              let test = excalidrawAPI?.getSceneElements();
              let appState = excalidrawAPI?.getAppState();
              console.info("test : " , test,"Elements :", elements, "appState: " ,appState, "State : ", state);
            }}
            // onPointerUpdate={(payload: {
            //   pointer: { x: number; y: number };
            //   button: "down" | "up";
            //   pointersMap: Gesture["pointers"];
            // }) => setPointerData(payload)}
            viewModeEnabled={viewModeEnabled}
            zenModeEnabled={zenModeEnabled}
            gridModeEnabled={gridModeEnabled}
            theme= {THEME.LIGHT}
            name="whiteboared"
            
            UIOptions={{
              welcomeScreen: true ,
              dockedSidebarBreakpoint: 200,
              tools: {image: true},
              canvasActions: {
                changeViewBackgroundColor: true,
                saveToActiveFile:false,
                toggleTheme:true,
                clearCanvas: true,
                saveAsImage:true,
                loadScene: true,
                export:{
                  saveFileToDisk:true,

                }
              },
            }}
            renderTopRightUI={renderTopRightUI}
            onLinkOpen={onLinkOpen}
            // onPointerDown={onPointerDown}
            // onScrollChange={rerenderCommentIcons}
            // renderSidebar={renderSidebar}
          >
            <WelcomeScreen />


{/* <Sidebar name="custom" docked={docked} onDock={setDocked}>
        <Sidebar.Header>Custom header!</Sidebar.Header>
        Custom sidebar!
      </Sidebar> */}

            {/* {excalidrawAPI && (
              <Footer>
                <CustomFooter excalidrawAPI={excalidrawAPI} />
              </Footer>
            )} */}
            {renderMenu()}
          </Excalidraw>
          {/* {Object.keys(commentIcons || []).length > 0 && renderCommentIcons()} */}
          {/* {comment && renderComment()} */}
        </div>

        <div className="export-wrapper  button-wrapper">
          {/* <label className="export-wrapper__checkbox">
            <input
              type="checkbox"
              checked={exportWithDarkMode}
              onChange={() => setExportWithDarkMode(!exportWithDarkMode)}
            />
            Export with dark mode
          </label> */}
          {/* <label className="export-wrapper__checkbox">
            <input
              type="checkbox"
              checked={exportEmbedScene}
              onChange={() => setExportEmbedScene(!exportEmbedScene)}
            />
            Export with embed scene
          </label> */}
          {/* <button
            onClick={async () => {
              if (!excalidrawAPI) {
                return;
              }
              const svg = await exportToSvg({
                elements: excalidrawAPI?.getSceneElements(),
                appState: {
                  ...initialData.appState,
                  exportWithDarkMode,
                  exportEmbedScene,
                  width: 300,
                  height: 100,
                },
                files: excalidrawAPI?.getFiles(),
              });
              appRef.current.querySelector(".export-svg").innerHTML =
                svg.outerHTML;
            }}
          >
            Export to SVG
          </button>
          <div className="export export-svg"></div> */}

          <button
            onClick={async () => {
              if (!excalidrawAPI) {
                return;
              }
              const blob = await exportToBlob({
                elements: excalidrawAPI?.getSceneElements(),
                mimeType: "image/png",
                appState: {
                  ...initialData.appState,
                  exportEmbedScene,
                  exportWithDarkMode,
                },
                files: excalidrawAPI?.getFiles(),
              });
              setBlobUrl(window.URL.createObjectURL(blob));
            }}
          >
            Export to Blob
          </button>
        

          <button
            onClick={async () => {
              if (!excalidrawAPI) {
                return;
              }
              const canvas = await exportToCanvas({
                elements: excalidrawAPI.getSceneElements(),
                appState: {
                  ...initialData.appState,
                  exportWithDarkMode,
                },
                files: excalidrawAPI.getFiles(),
              });
              const ctx = canvas.getContext("2d")!;
              ctx.font = "30px Virgil";
              ctx.strokeText("My custom text", 50, 60);
              setCanvasUrl(canvas.toDataURL());
            }}
          >
            Export to Canvas
          </button>
          <div className="export export-canvas">
            <img src={canvasUrl} alt="" />
          </div>
          <div className="export export-blob">
            <img src={blobUrl} alt="" />
          </div>
        </div>
      
      {/* </ExampleSidebar> */}
    </div>
  );
}
