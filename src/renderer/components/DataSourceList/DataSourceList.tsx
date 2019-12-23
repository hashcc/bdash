import React from "react";
import classNames from "classnames";
import { remote } from "electron";
import { DataSourceType } from "../../pages/DataSource/DataSourceStore";

type Props = {
  readonly dataSources: DataSourceType[];
  readonly selectedDataSourceId: number | null;
  readonly onClickNew: () => void;
  readonly onSelect: (dataSource: DataSourceType) => void;
  readonly onEdit: (dataSource: DataSourceType) => void;
  readonly onReload: (dataSource: DataSourceType) => void;
  readonly onDelete: (id: number) => void;
};

export default class DataSourceList extends React.Component<Props> {
  handleContextMenu(id: number) {
    if (id !== this.props.selectedDataSourceId) {
      const dataSource = this.find(id);
      if (dataSource) {
        this.props.onSelect(this.props.dataSources[id]);
      }
    }

    setImmediate(() => {
      const menu = remote.Menu.buildFromTemplate([
        {
          label: "Edit",
          click: () => {
            const dataSource = this.find(id);
            if (dataSource) {
              this.props.onEdit(dataSource);
            }
          }
        },
        {
          label: "Reload",
          click: () => {
            const dataSource = this.find(id);
            if (dataSource) {
              this.props.onReload(dataSource);
            }
          }
        },
        {
          label: "Delete",
          click: () => {
            if (window.confirm("Are you sure?")) {
              this.props.onDelete(id);
            }
          }
        }
      ]);
      menu.popup({ window: remote.getCurrentWindow() });
    });
  }

  find(id: number): DataSourceType | undefined {
    return this.props.dataSources.find(d => d.id === id);
  }

  render() {
    const items = this.props.dataSources.map(dataSource => {
      const className = classNames({
        "is-selected": this.props.selectedDataSourceId === dataSource.id
      });
      return (
        <li
          key={dataSource.id}
          className={className}
          onContextMenu={() => this.handleContextMenu(dataSource.id)}
          onClick={() => this.props.onSelect(dataSource)}
        >
          {dataSource.name}
        </li>
      );
    });

    return (
      <div className="DataSourceList">
        <div className="DataSourceList-new">
          <i className="fa fa-plus" onClick={() => this.props.onClickNew()} />
        </div>
        <ul className="DataSourceList-list">{items}</ul>
      </div>
    );
  }
}
