
window.onload = function () {
    // 声明一个object
    var style = {};
    // 克隆一个object
    style = mxUtils.clone(style);
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_LABEL;  // 不设置这个属性 背景图片不出来
    // 边框颜色
    style[mxConstants.STYLE_STROKECOLOR] = '#999999';
    // 边框大小
    style[mxConstants.STYLE_STROKEWIDTH] = 10;
    // 字体颜色
    style[mxConstants.STYLE_FONTCOLOR] = '#000000';
    // 文字水平方式
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    // 文字垂直对齐
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
    // 文字位于矩形下方
    style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_BOTTOM;
    // 字体大小
    style[mxConstants.STYLE_FONTSIZE] = 20;
    // 底图水平对齐
    style[mxConstants.STYLE_IMAGE_ALIGN] = mxConstants.ALIGN_CENTER;
    // 底图垂直对齐
    style[mxConstants.STYLE_IMAGE_VERTICAL_ALIGN] = mxConstants.ALIGN_CENTER;
    // 图片路径
    //style[mxConstants.STYLE_IMAGE] = 'editors/images/C.jpg';
    // 背景图片宽
    style[mxConstants.STYLE_IMAGE_WIDTH] = 35;
    // 背景图片高
    style[mxConstants.STYLE_IMAGE_HEIGHT] = 250;
    // 上间距设置
    // 即使下边定义了全局设置，但这里单独设置上边间距仍单独有效
    style[mxConstants.STYLE_SPACING_TOP] = 30;
    // 四边间距设置
    style[mxConstants.STYLE_SPACING] = 10;
    var outline = document.getElementById('outlineContainer');
    var container = document.getElementById("main");
    container.style.position = 'absolute';
    container.style.overflow = 'hidden';
    container.style.left = '24px';
    container.style.top = '36px';
    container.style.right = '0px';
    container.style.bottom = '0px';
    container.style.background = 'url("editors/images/grid.gif")';
    container.style.overflow = 'auto';
    /**********侧边栏**********/
    // 创建工具栏容器
    var tbContainer = document.createElement('div');
    tbContainer.style.position = 'absolute';
    tbContainer.style.overflow = 'hidden';
    tbContainer.style.padding = '2px';
    tbContainer.style.left = '0px';
    tbContainer.style.top = '50px';
    tbContainer.style.width = '24px';
    tbContainer.style.bottom = '0px';

    document.body.appendChild(tbContainer);

    // 创建工具栏监听工具
    var toolbar = new mxToolbar(tbContainer);
    toolbar.enabled = false
    // 解决IE浏览器忽略的样式
    if (mxClient.IS_QUIRKS) {
        document.body.style.overflow = 'hidden';
        new mxDivResizer(tbContainer);
        new mxDivResizer(container);
        new mxDivResizer(outline);
    }

    /************END侧边栏****************/
    //创建一个画板
    var graph = new mxGraph(container);
    // 禁用浏览器自带右键菜单
    mxEvent.disableContextMenu(document.body);
    // 去锯齿效果
    mxRectangleShape.prototype.crisp = true;
    // 创建下拉菜单
    new mxRubberband(graph);
    graph.setCellsResizable(true); //节点可改变大小
    mxGraphHandler.prototype.setMoveEnabled(false); //是否可以移动
    mxGraphHandler.prototype.guidesEnabled = false; //显示细胞位置标尺
    graph.setEnabled(true);//是否允许编辑
    graph.setCellsLocked(true);//是否可以移动连线，重新连接其他cell，主要用来展现中用
    graph.setConnectable(false); // 是否允许Cells通过其中部的连接点新建连接,false则通过连接线连接
    // 节点是否解析html
    graph.setHtmlLabels(true);
    // 开启提示
    graph.setTooltips(true);
    // 关闭方块上的文字编辑功能
    graph.setCellsEditable(false);
    //获取顶层，可以认为是父节点
    new mxCellTracker(graph);
    var parent = graph.getDefaultParent();
    // 把定义好的样式object push到stylesheet
    graph.getStylesheet().putCellStyle("style1", style);
    /*禁用节点双击，防止改变数据 */
    graph.dblClick = function (evt, cell) {
        if (cell.vertex == true && cell.geometry.width > 0 && cell.geometry.height > 0) {
            mini.open({
                targetWindow: window,
                url: "SetUnitInfo.html",
                title: "装置信息设置", width: 600, height: 400,
                onload: function () {
                },
                ondestroy: function (action) {
                    MatialIn(graph, cell);
                    MatialOut(graph, cell);
                }
            });
        }
        if (cell.edge == true) {
            mini.open({
                targetWindow: window,
                url: "HtmlPage1.html",
                title: "物料跟踪图", width: 600, height: 600,
                onload: function () {
                },
                ondestroy: function (action) {
                }
            });
        }
    };
    //单击监听事件
    graph.addListener(mxEvent.CLICK, function (sender, evt) {
        var e = evt.getProperty('event'); // mouse event
        var cell = evt.getProperty('cell'); // cell may be null

        if (cell != null) {
            evt.consume();
            $("#t1").val(cell.value);
            if (cell.edge == true) {
                var a = graph.getModel().getCell(2);
                graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, "#B43104", [a]);
            }
            else {
                var a = graph.getModel().getCell(2);
                graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, "#999999", [a]);
            }
        }
        else {
            $("#t1").val("");
            var a = graph.getModel().getCell(2);
            graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, "#999999", [a]);
        }
    });
    //移动监听
    graph.addListener(mxEvent.MOVE_CELLS, function (sender, evt) {
        var e = evt.getProperty('event'); // mouse event
        var cells = evt.getProperty('cells'); // cell may be null
        if (cells != null) {
            evt.consume();
            for (var i = 0; i < cells.length; i++) {
                if (cells[i].edge != true && cells[i].geometry.width > 0 && cells[i].geometry.height > 0) {
                    RefreshEdgeIn(graph, cells[i]);
                    RefreshEdgeOut(graph, cells[i]);
                }
            }
        }
    });
    //通过鼠标悬停事件禁止拖动线
    graph.addMouseListener(
    {
        currentState: null,
        previousStyle: null,
        mouseDown: function (sender, me) {
        },
        mouseMove: function (sender, me) {
            if (this.currentState != null && me.getState() == this.currentState) {
                return;
            }

            var tmp = graph.view.getState(me.getCell());

            // Ignores everything but vertices
            if (graph.isMouseDown || (tmp != null && !
                graph.getModel().isVertex(tmp.cell))) {
                tmp = null;
            }

            if (tmp != this.currentState) {
                if (this.currentState != null) {
                    this.dragLeave(me.getEvent(), this.currentState);
                }

                this.currentState = tmp;

                if (this.currentState != null) {
                    this.dragEnter(me.getEvent(), this.currentState);
                }
            }
        },
        mouseUp: function (sender, me) { },
        dragEnter: function (evt, state) {
            mxGraphHandler.prototype.setMoveEnabled(true);
            graph.setCellsLocked(false);
        },
        dragLeave: function (evt, state) {
            mxGraphHandler.prototype.setMoveEnabled(false);
            graph.setCellsLocked(true);
        }
    });
    //调整改变大小监听
    graph.addListener(mxEvent.CELLS_RESIZED, function (sender, evt) {
        /*重新绘制进出料位置*/
        var cells = evt.getProperty('cells');
        if (cells != null) {
            for (var i = 0; i < cells.length; i++) {
                /*修改样式*/
                RefreshEdgeIn(graph, cells[i]);
                RefreshEdgeOut(graph, cells[i]);
                graph.setCellStyles(mxConstants.STYLE_IMAGE_WIDTH, cells[i].geometry.width, [cells[i]]);
                graph.setCellStyles(mxConstants.STYLE_IMAGE_HEIGHT, cells[i].geometry.height, [cells[i]]);
                if (graph.getModel().getChildCount(cells[i]) > 0) {
                    var geo = graph.getCellGeometry(cells[i]);

                    if (geo != null) {
                        var children = graph.getChildCells(cells[i], true, true);
                        var bounds = graph.getBoundingBoxFromGeometry(children, true);

                        geo = geo.clone();
                        geo.width = Math.max(geo.width, bounds.width);
                        geo.height = Math.max(geo.height, bounds.height);

                        graph.getModel().setGeometry(cells[i], geo);
                    }
                }
            }
        }
    });
    // 覆写右键单击事件
    graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
        createPopupMenu(graph, menu, cell, evt);
    };
    //‘撤销’监听
    var undoMng = new mxUndoManager();
    var listener = function (sender, evt) {
        undoMng.undoableEditHappened(evt.getProperty('edit'));
    };
    graph.getModel().addListener(mxEvent.UNDO, listener);
    graph.getView().addListener(mxEvent.UNDO, listener);
    // 设置自动扩大鼠标悬停
    graph.panningHandler.autoExpand = true;
    var span = document.createElement("span");
    span.innerHTML = "值：";
    document.body.appendChild(span);
    var t1 = document.createElement("input");
    t1.type = "text";
    t1.id = "t1";
    document.body.appendChild(t1);
    // 提交
    document.body.appendChild(mxUtils.button('提交', function (evt) {
        if (graph.getSelectionCells().length != 1) {
            mxUtils.alert("请选择一个装置");
        }
        var cell = graph.getSelectionCells()[0];
        SubmitData(graph, cell);
    }));
    document.body.appendChild(mxUtils.button('导入', function (evt) {
        Import(graph);
    }));
    //删除选中Cell或者Edge
    var keyHandler = new mxKeyHandler(graph);
    keyHandler.bindKey(46, function (evt) {
        if (graph.isEnabled()) {
            graph.removeCells();
        }
    });
    // 居中缩放
    graph.centerZoom = true;
    // 放大按钮
    document.body.appendChild(mxUtils.button('放大 +', function (evt) {
        graph.zoomIn();
    }));
    // 缩小按钮
    document.body.appendChild(mxUtils.button('缩小 -', function (evt) {
        graph.zoomOut();
    }));
    // 还原按钮
    document.body.appendChild(mxUtils.button('还原 #', function (evt) {
        graph.zoomActual();
        graph.zoomFactor = 1.2;
        input.value = 1.2;
    }));
    var input = document.createElement("input");
    input.type = "text";
    input.value = graph.zoomFactor;
    input.style = "width:50px";
    input.addEventListener("blur", function () {
        graph.zoomFactor = parseFloat(this.value, 10);
    });
    document.body.appendChild(input);
    // 打印
    document.body.appendChild(mxUtils.button('打印', function (evt) {
        mxUtils.printScreen(graph);
    }));
    document.body.appendChild(mxUtils.button('复制', function (evt) {
        var cells = new Array();
        cells = graph.getSelectionCells();
        mxClipboard.copy(graph, cells);
    }));
    document.body.appendChild(mxUtils.button('剪贴', function (evt) {
        var cells = new Array();
        cells = graph.getSelectionCells();
        mxClipboard.cut(graph, cells);
    }));
    document.body.appendChild(mxUtils.button('粘贴', function (evt) {
        mxClipboard.paste(graph);
    }));
    document.body.appendChild(mxUtils.button('删除', function (evt) {
        var cells = new Array();
        cells = graph.getSelectionCells();
        for (var i = 0; i < cells.length; i++) {
            if (cells[i].geometry.height > 0) {
                var EdgeCount = cells[i].edges == null ? 0 : cells[i].edges.length;
                for (var j = 0; j < EdgeCount; j++) {
                    if (cells[i].edges[0].target == cells[i]) {
                        var CellArray = [cells[i].edges[0].source];
                        mxClipboard.removeCells(graph, CellArray);
                    }
                    else if (cells[i].edges[0].source == cells[i]) {
                        var CellArray = [cells[i].edges[0].target];
                        mxClipboard.removeCells(graph, CellArray);
                    }
                }
                mxClipboard.removeCells(graph, [cells[i]]);
            }
        }

    }));
    document.body.appendChild(mxUtils.button('Undo', function () {
        undoMng.undo();
    }));

    document.body.appendChild(mxUtils.button('Redo', function () {
        undoMng.redo();
    }));
    document.body.appendChild(mxUtils.button('刷新', function (evt) {
        RefreshModel(graph);
    }));

    document.body.appendChild(mxUtils.button('View XML', function () {
        var encoder = new mxCodec();
        var node = encoder.encode(graph.getModel());
        var str = mxUtils.getPrettyXml(node)
        mxUtils.popup(str, true);   //以窗口的方式展示处理
        //var s = getXmlNode(str);
        //var obj = eval('(' + s + ')');
        //console.log(obj);
    }));
    document.body.appendChild(mxUtils.button('计算', function () {
        var message = "计算完成";
        mxUtils.popup(message, true);   //以窗口的方式展示处理
    }));
    document.body.appendChild(mxUtils.button('整理', function (evt) {
        graph.selectAll();
        var cells = new Array();
        cells = graph.getSelectionCells();
        var NX = 250;
        var NY = 50;
        var ColCount = 0;
        if (cells != null) {
            for (var i = 0; i < cells.length; i++) {
                //节点大小为0的不参与整理
                if (cells[i].geometry.height > 0) {
                    var CellArray = [cells[i]];
                    var OY = CellArray[0].geometry.y;
                    var OX = CellArray[0].geometry.x;
                    graph.moveCells(CellArray, NX - OX, NY - OY);
                    NX = NX + 450;
                    ColCount++;
                    if (ColCount >= 3) {
                        NY = NY + 430;
                        ColCount = 0;
                        NX = 250;
                    }
                }
            }
            graph.removeSelectionCells(cells);
        }
    }));
    /***********左侧装置栏************/
    addToolbarItem(graph, toolbar, 'C', 'editors/images/CI1.png');
    addToolbarItem(graph, toolbar, 'V', 'editors/images/VI.png');
    // 图形窗口的右上角的周围创建导航提示。
    var outln = new mxOutline(graph, outline);

}
function MatialIn(graph, cell) {
    var parent = graph.getDefaultParent();
    var v1 = graph.insertVertex(parent, null, "", cell.geometry.x - 200, cell.geometry.y + (cell.geometry.height) / 2, 0, 0);
    // 在一个步骤中，加入所有的单元到模型中
    graph.getModel().beginUpdate();
    try {
        var e1 = graph.insertEdge(parent, null, '进料·······0.00·······100%', v1, cell, "entryX=0;entryY=0.5;verticalAlign=bottom;");
    }
    finally {
        // 更新显示
        graph.getModel().endUpdate();
    }
    RefreshEdgeIn(graph, cell);
}
function RefreshEdgeIn(graph, cell) {
    var Count = 0;
    if (cell.edges == null) {
        return;
    }
    for (var i = 0; i < cell.edges.length; i++) {
        if (cell.edges[i].target == cell) {
            Count++;
        }
    }
    if (Count == 0)
    { return; }
    var EdgeCount = 0;
    for (var i = 0; i < cell.edges.length; i++) {
        if (cell.edges[i].target == cell) {
            var CellArray = [cell.edges[i].source];
            var OY = CellArray[0].geometry.y;
            var NY = cell.geometry.y + (cell.geometry.height) / (Count + 1) * (EdgeCount + 1);
            var OX = CellArray[0].geometry.x;
            var NX = cell.geometry.x - 200;
            EdgeCount++;
            graph.moveCells(CellArray, NX - OX, NY - OY);
            var Edge = cell.edges[i];
            var EdgeSourceHeight = (NY - cell.geometry.y) / cell.geometry.height;
            graph.setCellStyles(mxConstants.STYLE_ENTRY_X, 0, [Edge]);
            graph.setCellStyles(mxConstants.STYLE_ENTRY_Y, EdgeSourceHeight, [Edge]);
        }
    }

}
function MatialOut(graph, cell) {
    var parent = graph.getDefaultParent();
    var v1 = graph.insertVertex(parent, null, "", (cell.geometry.x + cell.geometry.width) + 200, cell.geometry.y + (cell.geometry.height) / 2, 0, 0);
    // 在一个步骤中，加入所有的单元到模型中
    graph.getModel().beginUpdate();
    try {
        var e1 = graph.insertEdge(parent, null, '出料·······0.00·······100%', cell, v1, "exitX=1;exitY=0.5;verticalAlign=bottom;");

    }
    finally {
        // 更新显示
        graph.getModel().endUpdate();
    }
    RefreshEdgeOut(graph, cell);
}
function RefreshEdgeOut(graph, cell) {
    var Count = 0;
    if (cell.edges == null) {
        return;
    }
    for (var i = 0; i < cell.edges.length; i++) {
        if (cell.edges[i].source == cell) {
            Count++;
        }
    }
    if (Count == 0)
    { return; }
    var EdgeCount = 0;
    for (var i = 0; i < cell.edges.length; i++) {
        if (cell.edges[i].source == cell) {
            var CellArray = [cell.edges[i].target];
            var OY = CellArray[0].geometry.y;
            var NY = cell.geometry.y + (cell.geometry.height) / (Count + 1) * (EdgeCount + 1);
            var OX = CellArray[0].geometry.x;
            var NX = cell.geometry.x + cell.geometry.width + 200;
            EdgeCount++;
            graph.moveCells(CellArray, NX - OX, NY - OY);
            var Edge = cell.edges[i];
            var EdgeTargetHeight = (NY - cell.geometry.y) / cell.geometry.height;

            //Edge.setStyle("exitX=1;exitY=" + EdgeTargetHeight + ";");
            graph.setCellStyles(mxConstants.STYLE_EXIT_X, 1, [Edge]);
            graph.setCellStyles(mxConstants.STYLE_EXIT_Y, EdgeTargetHeight, [Edge]);
        }
    }
}
function AddUnit(graph, X, Y, type) {
    var Unit;
    if (type == "C") {
        Unit = graph.insertVertex(graph.getDefaultParent(), null, '常压', X, Y, 35, 250, "style1");
        graph.setCellStyles(mxConstants.STYLE_IMAGE, "editors/images/C.jpg", [Unit]);
    }
    if (type == "V") {
        Unit = graph.insertVertex(graph.getDefaultParent(), null, '调和池', X, Y, 35, 250, "style1");
        graph.setCellStyles(mxConstants.STYLE_IMAGE, "editors/images/V.jpg", [Unit]);
    }
}
function Import(graph) {
    var xml = '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="常压" vertex="1" parent="1"><mxGeometry x="400" y="230" width="50" height="400" as="geometry"/><Object shape="label" strokeColor="#999999" strokeWidth="10" fontColor="#FFFF00" align="center" verticalAlign="bottom" fontSize="30" imageAlign="center" imageVerticalAlign="center" image="editors/images/C.jpg" imageWidth="50" imageHeight="400" spacingTop="30" spacing="10" as="style"/></mxCell><mxCell id="3" value="常压" vertex="1" parent="1"><mxGeometry x="690" y="210" width="50" height="400" as="geometry"/><Object shape="label" strokeColor="#999999" strokeWidth="10" fontColor="#FFFF00" align="center" verticalAlign="bottom" fontSize="30" imageAlign="center" imageVerticalAlign="center" image="editors/images/C.jpg" imageWidth="50" imageHeight="400" spacingTop="30" spacing="10" as="style"/></mxCell><mxCell id="6" value="" vertex="1" parent="1"><mxGeometry x="200" y="363.33333333333337" as="geometry"/></mxCell><mxCell id="7" value="to" style="Edge" edge="1" parent="1" source="6" target="2"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="8" value="" vertex="1" parent="1"><mxGeometry x="200" y="496.6666666666667" as="geometry"/></mxCell><mxCell id="9" value="to" style="Edge" edge="1" parent="1" source="8" target="2"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="12" value="" vertex="1" parent="1"><mxGeometry x="490" y="343.33333333333337" as="geometry"/></mxCell><mxCell id="13" value="to" style="Edge" edge="1" parent="1" source="12" target="3"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="14" value="" vertex="1" parent="1"><mxGeometry x="490" y="476.6666666666667" as="geometry"/></mxCell><mxCell id="15" value="to" style="Edge" edge="1" parent="1" source="14" target="3"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel>';
    var doc = mxUtils.parseXml(xml);
    var codec = new mxCodec(doc);
    codec.decode(doc.documentElement, graph.getModel());
}
// Function to create the entries in the popupmenu
function createPopupMenu(graph, menu, cell, evt) {
    ////console.log(evt.offsetX + "-" + evt.offsetY);
    if (cell != null) {
        menu.addItem('添加进料', null, function () {
            if (graph.getSelectionCells().length != 1) {
                mxUtils.alert("请选择一个装置");
            }
            var cell = graph.getSelectionCells()[0];
            MatialIn(graph, cell);
        });
        menu.addItem('添加出料', null, function () {
            if (graph.getSelectionCells().length != 1) {
                mxUtils.alert("请选择一个装置");
            }
            var cell = graph.getSelectionCells()[0];
            MatialOut(graph, cell)
        });
    }
    else {
        menu.addItem('添加常压装置', null, function () {
            AddUnit(graph, evt.offsetX, evt.offsetY, "C");
        });
        menu.addItem('添加调和池装置', null, function () {
            AddUnit(graph, evt.offsetX, evt.offsetY, "V");
        });
    }
};
function SubmitData(graph) {
    graph.getModel().beginUpdate();
    try {
        var cell = graph.getSelectionCells()[0];
        cell.setValue($("#t1").val());
    }
    finally {
        graph.getModel().endUpdate();
    }
    RefreshModel(graph);
}
//刷新
function RefreshModel(graph) {
    var encoder = new mxCodec();
    var result = encoder.encode(graph.getModel());
    var xml = mxUtils.getXml(result);
    var doc = mxUtils.parseXml(xml);
    var codec = new mxCodec(doc);
    codec.decode(doc.documentElement, graph.getModel());
}
function addToolbarItem(graph, toolbar, type, image) {
    // 添加功能
    var funct = function (graph, evt, cell) {
        var pt = graph.getPointForEvent(evt);
        AddUnit(graph, pt.x, pt.y, type);
    }

    // 创建拖动预览图标
    var img = toolbar.addMode(null, image, funct);
    mxUtils.makeDraggable(img, graph, funct);
}